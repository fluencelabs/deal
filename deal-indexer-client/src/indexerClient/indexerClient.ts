import { DocumentNode } from "graphql";
import { execute } from "../../.graphclient";

// TODO: add responseType
export async function requestIndexer(documentNode: DocumentNode, options: unknown): Promise<unknown | null> {
    const result = await execute(documentNode, options);
    console.info("[requestIndexer] Sent %s, Got: %s", documentNode, JSON.stringify(result));
    return result.data;
}
