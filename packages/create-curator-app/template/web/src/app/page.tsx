import { isAdminUser } from "@curatorjs/bridge";
import { headers } from "next/headers";

const getData = async function () {
  const showDrafts = await isAdminUser(headers());
  const response = await fetch(
    `http://127.0.0.1:1337/api/pages?publicationState=${
      showDrafts ? "preview" : "live"
    }`,
    {
      headers: {
        Autorization: "API_TOKEN",
      },
    }
  );

  return response.json();
};

export default async function Home() {
  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {data?.data?.map(({ id, attributes }: any) => (
        <div
          key={id}
          data-bridge-connect=""
          data-bridge-api-id="page"
          data-bridge-id={id}
        >
          {attributes.title}
        </div>
      ))}
    </main>
  );
}
