export async function HttpSend(
    strEncoded: string,
    urlTo: string,
    method: string
): Promise<any> {
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch(`http://adasremote.natapp1.cc/${urlTo}`, {
        method: method,
        headers: headers,
        body: strEncoded,
    });
    const result = await response.json();
    if (result.status === "-1") {
        return HttpSend(strEncoded, urlTo, method);
    } else if (result.status === "-1") {
        throw new Error(result.message);
    }
    return result.message;
}

export async function HttpSendFormData(
    strEncoded: string,
    urlTo: string,
    method: string
): Promise<any> {
    const headers = {
        "Content-Type": "multipart/form-data",
    };

    const response = await fetch(`https://127.0.0.1:8888/${urlTo}`, {
        method: method,
        headers: headers,
        body: strEncoded,
    });
    const result = await response.json();
    if (result.status === "-1") {
        throw new Error(result.message);
    }
    return result.message;
}

// 后续使用：
// let res_check = await HttpSend(
//   JSON.stringify(datasetcreation.value),
//   "dataset/upload",
//   "POST"
// );