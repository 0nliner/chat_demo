export function authorizedFetch ({url, data}) {
    let checkTokenRequest = fetch(`http://127.0.0.1:8000/auth/jwt/verify/`,
        {
            method: "POST",
            body: JSON.stringify({
                token: localStorage.getItem("access_token")
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(async (response) =>
        {
            // check traceback. If token is bad - redirect on login page
            if (response.status === 401) {
                console.log("Token expired. redirecting on login page...")
                localStorage.setItem("access_token", "");
                window.location = "/login";
                return;
            }
            else if (response.status === 200) {
                console.log("token is OK")
            }
            else {
                console.log("Error " + response.status)
                console.log(response.statusText)
            }
        });



    let init = null;

    if (!data || data && data.method !== "POST") {
        init =
            {
                method: data && data.method ? data.method : "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                },
            }
    }

    else if (data && data.method && data.method === "POST") {
        init =
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                },
                body: JSON.stringify(
                    data && data.body ? data.body : {}
                )

            }

    }

    let mainRequest = fetch(url, init);

    return checkTokenRequest.then(async response => await mainRequest);
}