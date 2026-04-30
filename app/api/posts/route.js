export async function GET() {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sorts: [
          {
            property: "Schedule Date",
            direction: "descending",
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return Response.json(data, { status: response.status });
  }

  const posts = data.results.map((page) => {
  const props = page.properties;
  const files = props.Attachments?.files || [];

  const media = files.map((file) => ({
    url:
      file?.type === "file"
        ? file.file.url
        : file?.external?.url || null,
    name: file?.name || "",
  }));

  return {
  id: page.id,
  notionUrl: page.url,
  title: props.Name?.title?.[0]?.plain_text || "Untitled",

  filter: props.Filter?.select?.name || "",

  status: props.Status?.status?.name || props.Status?.select?.name || "",
  platform: props.Platform?.select?.name || "",
  date: props["Schedule Date"]?.date?.start || "",
  media,
};
});
  return Response.json(posts);
}