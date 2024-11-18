import { MdAdd } from "react-icons/md";

export const AddTrustFundButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="w-[280px] bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999]  p-[1px] h-[280px] rounded-xl cursor-pointer"
    >
      <div className="w-full h-full bg-black rounded-inherit p-5 flex flex-col justify-center">
        <div>
          <div className="bg-gradient-to-r from-[#8AD4EC99] via-[#EF96FF99] to-[#FF56A999]  p-[1px] w-[50px] h-[50px] rounded-full">
            <div className="w-full h-full bg-black rounded-inherit flex items-center justify-center">
              <span>
                <MdAdd color="#FF56A999" size={30} />
              </span>
            </div>
          </div>

          <h3 className="text-xl text-white mt-3">Add Trust Fund</h3>
        </div>
      </div>
    </div>
  );
};
