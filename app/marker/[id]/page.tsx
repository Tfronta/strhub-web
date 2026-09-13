import { MarkerView } from "./MarkerView";

export default function MarkerPage({ params }: { params: { id: string } }) {
  return <MarkerView params={params} />;
}
