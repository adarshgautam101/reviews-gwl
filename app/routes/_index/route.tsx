import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <header className={styles.hero}>
          <h1 className={styles.heading}>Elevate Your Customer Experience</h1>
          <p className={styles.text}>
            The all-in-one review platform designed to build trust, boost conversions, and grow your brand with authentic customer feedback.
          </p>
        </header>

        {showForm && (
          <div className={styles.loginCard}>
            <Form className={styles.form} method="post" action="/auth/login">
              <label className={styles.label}>
                <span>Shop Domain</span>
                <input
                  className={styles.input}
                  type="text"
                  name="shop"
                  placeholder="my-shop.myshopify.com"
                  required
                />
                <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                  Enter your Shopify store URL to get started
                </span>
              </label>
              <button className={styles.button} type="submit">
                Install & Get Started
              </button>
            </Form>
          </div>
        )}

        <ul className={styles.list}>
          <li className={styles.featureItem}>
            <strong>Smart Review Widgets</strong>
            <p>Beautiful, customizable widgets that match your brand perfectly and look great on any device.</p>
          </li>
          <li className={styles.featureItem}>
            <strong>Automated Requests</strong>
            <p>Send perfectly timed review requests via email or SMS to maximize your response rates.</p>
          </li>
          <li className={styles.featureItem}>
            <strong>Photo & Video Reviews</strong>
            <p>Let your customers tell their story with rich media that builds unbeatable social proof.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

