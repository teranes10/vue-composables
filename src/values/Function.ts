export function useGetParameters(functionStr: string): string[] {
  const params = functionStr.match(/\(([^)]*)\)/)?.[1] || "";
  return params
    .split(",")
    .map((param) => param.trim())
    .filter(Boolean);
}

export function useGetAccessedProps(functionStr: string) {
  const arrowIndex = functionStr.indexOf("=>");
  let body = functionStr.slice(arrowIndex + 2).trim();

  if (body.startsWith("{") && body.endsWith("}")) {
    body = body.slice(1, -1).trim();
  }

  const params = useGetParameters(functionStr);
  const propAccesses = body.match(
    new RegExp(`\\b(?:${params.join("|")})\\.[\\w.]+\\b`, "g")
  );

  if (!propAccesses) {
    return {};
  }

  const accesses: Record<string, string[]> = {};
  propAccesses.forEach((access) => {
    const [param, ...props] = access.split(".");
    const propPath = props.join(".");

    if (accesses[param]) {
      accesses[param].push(propPath);
    } else {
      accesses[param] = [propPath];
    }
  });

  return accesses;
}

export async function useFunctionCaller(func: any, arg: any) {
  if (typeof func !== "function") {
    return;
  }

  if (func.constructor.name === "Function") {
    return func(arg);
  }

  if (func.constructor.name === "AsyncFunction") {
    return await func(arg);
  }
}
