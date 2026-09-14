// module
// everything inside module are private
// unless you import and export

export interface BookProps {
  authors: string[];
  title: string;
  year: number;
  isPublished: boolean;
  problem: string | null;
  optionalThing?: string;
  misc?: {
    policy: string;
    isPatented: true;
  };
}

// destructuring inside the props
export default function Book({
  authors,
  title,
  year,
  isPublished,
  misc,
}: BookProps) {
  return (
    <div>
      <div>Title: {title}</div>
      <div>Year: {year}</div>
      {/* conditional rendering */}
      <div>{isPublished ? "Published" : "Not yet published"}</div>
      {/* <div>Author: {authors}</div> */}

      <div>{misc?.policy}</div>
      <div>{misc?.isPatented ? "patented" : "not patented"}</div>
    </div>
  );
}
