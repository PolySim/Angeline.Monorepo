"use client";

const ImageContainer = ({
  children,
  imageId,
}: {
  children: React.ReactNode;
  imageId: string;
}) => {
  return (
    <div
      onClick={() => {}}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="group relative w-full aspect-video cursor-pointer hover:scale-[0.98] transition duration-150"
    >
      {children}
    </div>
  );
};

export default ImageContainer;
