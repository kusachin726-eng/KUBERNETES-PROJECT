import "server-only";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";

export function getApiBaseUrl() {
  const baseUrl = process.env.DROPTY_API_BASE_URL;
  return baseUrl && baseUrl.length > 0 ? baseUrl.replace(/\/$/, "") : null;
}

export async function apiGetJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error(
      "DROPTY_API_BASE_URL is not set. Add it to .env.local to enable external API calls.",
    );
  }
  

  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      // redirect("/api/force-logout");
      // redirect("/api/auth/signout?callbackUrl=/login");
      redirect(
      `${process.env.NEXTAUTH_URL}/api/auth/signout?callbackUrl=${process.env.NEXTAUTH_URL}/login`
    );

    }

    let errorMessage = `Request failed with status ${res.status}`;

    try {
      const data = await res.json();
      if (data?.message) {
        errorMessage = data.message;
      }
    } catch {}

    throw new Error(errorMessage);
  }

  return (await res.json()) as T;
}

export async function apiPostJson<T>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("DROPTY_API_BASE_URL is not set");
  }

  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {

     if (res.status === 401) {
      // redirect("/api/force-logout");
      // redirect("/api/auth/signout?callbackUrl=/login");
      redirect(
        `${process.env.NEXTAUTH_URL}/api/auth/signout?callbackUrl=${process.env.NEXTAUTH_URL}/login`
      );
    }

    throw {
      status: res.status,
      message: data?.message || "Request failed",
    };
  }

  // if (!res.ok) {
  //   if (res.status === 401) {
  //     redirect("/api/force-logout");
  //     // redirect("/api/auth/signout?callbackUrl=/login");
  //   }

  //   let errorMessage = `Request failed with status ${res.status}`;

  //   try {
  //     const data = await res.json();
  //     if (data?.message) {
  //       errorMessage = data.message;
  //     }
  //   } catch {}

  //   throw new Error(errorMessage);
  // }

  return data as T;
}


export async function apiDeleteJson<T, B = unknown>(
  path: string,
  body?: B,
  init: RequestInit = {},           // default to empty object
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error(
      "DROPTY_API_BASE_URL is not set. Add it to .env.local to enable external API calls.",
    );
  }

  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  // ────────────────────────────────────────────────
  //   MERGE HEADERS CORRECTLY — this was the main bug
  // ────────────────────────────────────────────────
  const headers = new Headers(init.headers);   // Start with whatever caller provided

  headers.set("Accept", "application/json");   // Default Accept header

  if (body) {
    headers.set("Content-Type", "application/json");
  }

  // ────────────────────────────────────────────────

  const res = await fetch(url, {
    method: "DELETE",
    cache: "no-store",
    ...init,                    // other options (credentials, signal, etc.)
    headers,                    // ← use the merged Headers object
    body: body ? JSON.stringify(body) : undefined,
  });

  // if (!res.ok) {
  //   const text = await res.text().catch(() => "");
  //   throw new Error(
  //     `External API DELETE ${url} failed: ${res.status} ${res.statusText}${
  //       text ? `\n${text}` : ""
  //     }`,
  //   );
  // }

  if (!res.ok) {
     if (res.status === 401) {
      // redirect("/api/force-logout");
      // redirect("/api/auth/signout?callbackUrl=/login");
      redirect(
        `${process.env.NEXTAUTH_URL}/api/auth/signout?callbackUrl=${process.env.NEXTAUTH_URL}/login`
      );
    }

    throw new Error("Failed to delete resource");
  }
 
  // // Most DELETE endpoints return 204 No Content → avoid json() error
  if (res.status === 204) {
    // You can return different things depending on your app's convention
    // Option A: empty object (type-safe for most cases)
    return {} as T;
  }

  // if (!res.ok) {
  //   if (res.status === 401) {
  //     redirect("/api/force-logout");
  //     // redirect("/api/auth/signout?callbackUrl=/login");
  //   }

  //   let errorMessage = `Request failed with status ${res.status}`;

  //   try {
  //     const data = await res.json();
  //     if (data?.message) {
  //       errorMessage = data.message;
  //     }
  //   } catch {}

  //   throw new Error(errorMessage);
  // }


  return (await res.json()) as T;
}

export async function apiPatchJson<T>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error(
      "DROPTY_API_BASE_URL is not set. Add it to .env.local to enable external API calls.",
    );
  }

  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    method: "PATCH",
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
  });

  // ✅ READ RESPONSE BODY ONCE
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // response not JSON
  }

  // ❌ API ERROR
  if (!res.ok) {
     if (res.status === 401) {
      // redirect("/api/force-logout");
      // redirect("/api/auth/signout?callbackUrl=/login");
      redirect(
        `${process.env.NEXTAUTH_URL}/api/auth/signout?callbackUrl=${process.env.NEXTAUTH_URL}/login`
      );
    }

    throw new Error(data?.message || "Failed to update resource");
  }
 
  // ✅ SUCCESS
  return data as T;
}
// generic function for put api 

export async function apiPutJson<T>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("DROPTY_API_BASE_URL is not set");
  }

  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    method: "PUT",
    cache: "no-store",
    ...init, // ✅ ADD THIS (important)
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    if (res.status === 401) {
      redirect(
        `${process.env.NEXTAUTH_URL}/api/auth/signout?callbackUrl=${process.env.NEXTAUTH_URL}/login`
      );
    }
    throw new Error(data?.message || "Failed to update profile");
  }

  return data as T;
}

// api call for the post form data 
export async function apiPostFormData<T>(
  path: string,
  formData: FormData,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("DROPTY_API_BASE_URL is not set");
  }

  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    method: "POST",
    cache: "no-store",
    ...init, // ✅ keep same pattern as PUT
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}), // ❌ DO NOT set Content-Type here
    },
    body: formData, // ✅ only difference
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      redirect(
        `${process.env.NEXTAUTH_URL}/api/auth/signout?callbackUrl=${process.env.NEXTAUTH_URL}/login`
      );
    }

    throw {
      status: res.status,
      message: data?.message || "Request failed",
    };
  }

  return data as T;
}
/* ============================================================
   GET IMAGE WITH AUTH TOKEN
============================================================ */

export async function apiGetImage(
  path: string,
  init?: RequestInit
): Promise<Blob> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new Error("DROPTY_API_BASE_URL is not set");
  }

  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      redirect(
        `${process.env.NEXTAUTH_URL}/api/auth/signout?callbackUrl=${process.env.NEXTAUTH_URL}/login`
      );
    }

    throw new Error("Failed to fetch image");
  }

  return await res.blob(); // ✅ important
}


