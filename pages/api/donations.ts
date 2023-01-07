// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { AIRTABLE_APP_ID, AIRTABLE_BEARER_TOKEN } from "../../config";
import { AirtableRecord } from "../../styles/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_APP_ID}/donations?maxRecords=10000&view=Grid%20view`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AIRTABLE_BEARER_TOKEN}`,
    },
  });
  const data = (await response.json()) as AirtableRecord;
  return res.status(200).json(data.records);
}
