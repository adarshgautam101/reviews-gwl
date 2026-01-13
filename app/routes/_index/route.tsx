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
          <h1 className={styles.heading}>Customer Reviews App</h1>
          <p className={styles.text}>
            Easily collect and display customer reviews on your store.
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
                  placeholder="example.myshopify.com"
                  required
                />
              </label>
              <button className={styles.button} type="submit">
                Log in
              </button>
            </Form>
          </div>
        )}

        <ul className={styles.list}>
          <li className={styles.featureItem}>
            <strong>Easy Setup</strong>
            <p>Install the app and start collecting reviews in minutes.</p>
          </li>
          <li className={styles.featureItem}>
            <strong>Review Widgets</strong>
            <p>Display reviews beautifully on your product pages.</p>
          </li>
          <li className={styles.featureItem}>
            <strong>Auto Requests</strong>
            <p>Automatically ask customers for reviews after purchase.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
