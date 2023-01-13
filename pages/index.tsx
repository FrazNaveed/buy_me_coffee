import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { DONATION_IN_CENTS, MAX_DONATION_IN_CENTS } from "../config";
import { GetServerSideProps } from "next";
import { Record } from "../styles/types";
import Image from "next/image";

import coffeeImage from "../public/coffee-cup.png";

export default function Home({ donations }: { donations: Array<Record> }) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const presets = [1, 3, 5];
  const _donations = donations.reverse();
  async function handleCheckout() {
    setError(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity,
        name,
        message,
      }),
    });
    const res = await response.json();
    if (res.url) {
      const url = res.url;
      router.push(url);
    }
    if (res.error) {
      console.error(res.error);
      setError(res.error);
    }
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex flex-col md:flex-row max-w-2xl m-auto justify-center w-full items-center min-h-screen">
        <div className="flex mt-5 flex-col flex-1 mx-w-100 h-max overflow-auto">
          {_donations.map((donation) => {
            return (
              <div
                key={donation.id}
                className="p-4 shadow border border-yellow-100 mb-2 mr-20 w-auto"
              >
                {donation.fields.name} donated{" "}
                <strong>${donation.fields.amount}</strong>
                <br />
                {donation.fields.message}
              </div>
            );
          })}
        </div>
        <div>
          <h3 className="font-medium leading-tight text-5xl mt-0 mb-2">
            Buy me a coffee
          </h3>
          {error && <div>{error}</div>}
          <div className="flex items-center full-w mb-2">
            <Image src={coffeeImage} alt="coffee-img" width={70} height={70} />
            <span>x</span>
            {presets.map((preset) => {
              return (
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 ml-2"
                  key={preset}
                  onClick={() => setQuantity(preset)}
                >
                  {preset}
                </button>
              );
            })}
            <input
              className="shadow rounded w-full border border-yellow-500 p-2"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(parseFloat(e.target.value));
              }}
              min={1}
              max={MAX_DONATION_IN_CENTS / DONATION_IN_CENTS}
            />
          </div>
          <div className="mb-2 w-full">
            <label htmlFor="name" className="block">
              Name (optional)
            </label>
            <input
              className="shadow rounded w-full border border-yellow-500 p-2"
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="John"
            />
          </div>

          <div className="mb-2 w-full">
            <label htmlFor="message">Message (optional)</label>
            <textarea
              className="shadow rounded w-full border border-yellow-500 p-2"
              id="message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Thank you"
            />
          </div>

          <button
            className="bg-yellow-600 rounded shadow px-4 py-2 text-white"
            onClick={handleCheckout}
          >
            Donate ${quantity * (DONATION_IN_CENTS / 100)}
          </button>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers["x-forwarded-proto"] || "http";
  const response = await fetch(
    `${protocol}://${context.req.headers.host}/api/donations`
  );
  const donations = await response.json();
  return {
    props: {
      donations,
    },
  };
};
