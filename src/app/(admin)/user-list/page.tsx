"use client";

import {
  FormEvent,
  ReactNode,
  use,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import Button from "@/components/button";
import Table from "@/components/table";
import Link from "next/link";
import Paginate from "@/components/paginate";
import Modal from "@/components/modal";
import Field from "@/components/field";
import {
  deleteUser,
  getWithCredentials,
  postWithCredentialsJson,
  postWithForm,
  postWithJson,
  updateWithJson,
} from "@/lib/api";
import { toastError, toastSuccess } from "@/components/toast";
import { UserContext } from "@/lib/context/user-context";
import { any, z } from "zod";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { tr } from "date-fns/locale";
import { IoIosAdd, IoIosBrush, IoIosTrash } from "react-icons/io";
import Dropdown from "@/components/dropdown";
import { FiTrash2 } from "react-icons/fi";
import { auth } from "../../../../firebase";
import { getAuth } from "firebase/auth";

interface DataUser {
  Name: string;
  Email: string;
  Phone: string;
  password?: string;
  confirm_password?: string;
  Action?: JSX.Element;
}

interface DataEmailAdmin {
  Email: string;
  Action?: JSX.Element;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  address: string;
  role: string;
}

export default function UserList() {
  const context = useContext(UserContext);
  const router = useRouter();
  const [search, setSearch] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [pageEmail, setPageEmail] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPagesEmail, setTotalPagesEmail] = useState(1);
  const [dataTableEmail, setDataTableEmail] = useState<DataEmailAdmin[]>([]);
  const [dataTable, setDataTable] = useState<DataUser[]>([]);
  const [dataUser, setDataUser] = useState<DataUser[]>([]);
  const [emailAdmin, setEmailAdmin] = useState<DataEmailAdmin[]>([]);
  const [showPopUpChangePassword, setShowPopUpChangePassword] =
    useState<boolean>(false);
  const [showPopUpAddUser, setShowPopUpAddUser] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [showPopUpDelete, setShowPopUpDelete] = useState<boolean>(false);
  const [showPopUpEmailAdmin, setShowPopUpEmailAdmin] = useState<boolean>(false);
  const headerEmailAdmin = ["EMAIL","ACTION"];
  const [addEmailAdmin, setAddEmailAdmin] = useState("");

  const [registerData, setRegisterData] = useReducer(
    (prev: RegisterData, next: Partial<RegisterData>) => {
      return { ...prev, ...next };
    },
    {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      address: "",
      role: "",
    }
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>();
  const header = ["Name", "Email", "Phone", "Action"];

  const optionRole = [
    { value: "ADMIN", label: "ADMIN" },
    { value: "USER", label: "USER" },
  ];

  const schema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z
      .string()
      .refine((data) => data === registerData.password, {
        message: "Confirm password must match with your password",
      })
      .nullable(),
  });

  const getEmailAdmin = async () => {
    try {
      if (context.token) {
        const response = await getWithCredentials("admin/email", context.token);
        const data = response.data.data as EmailAdmin[];
        setEmailAdmin(
          data
            .map((item) => {
              return {
                Email: item.email,
                Action: (
                  <div
                    className="min-w-[188px] w-full flex gap-1 object-contain justify-center"
                  >
                    <div
                      className="w-7 lg:w-9 h-7 lg:h-9 text-[20px] md:text-[24px] lg:text-[28px] flex justify-center items-center rounded-[4px] text-white bg-red-600 hover:bg-red-secondary cursor-pointer"
                      onClick={() => {
                        handleDeleteEmailAdmin(item.ID)
                      }}
                    >
                      <IoIosTrash />
                    </div>
                  </div>
                )
              };
            })
        );
      }
    } catch (error) {
      toastError((error as any).response?.data?.error);
    }
  };
  useEffect(() => {
    getEmailAdmin();
  }, []);

  const handleDeleteEmailAdmin = async (id:number) => {
    try {
      if (context.token) {
        const response = await deleteUser(
          `admin/email/delete/${id}`,
          context.token
        );
        await getEmailAdmin()
        toastSuccess(response.data.message)
      }
    } catch (error) {
      console.error("Error deleting Email Admin : ", error);
      const errorMessage =
        (error as any).response?.data?.error || "Failed to delete Email Admin.";
      toastError(errorMessage);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleAddEmailAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      if (context.token) {
        const response = await postWithForm(
          `admin/email/add`,{
            email: addEmailAdmin
          },
          context.token
        );
        toastSuccess(response.data.message)
        await getEmailAdmin()
      }
    } catch (error) {
      console.error("Error Adding Category:", error);
      const errorMessage =
        (error as any).response?.data?.error || "Failed to Add Category.";
      toastError(errorMessage);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const getUser = async () => {
    try {
      if (context.token) {
        const response = await getWithCredentials("admin/users", context.token);
        const data = response.data.data as User[];
        setDataUser(
          data
            .filter((val) => val.role === "USER")
            .map((user) => {
              return {
                Name: user.name,
                Email: user.email,
                Phone: user.phone,
                Action: (
                  <div
                    key={user.ID}
                    className="min-w-[188px] w-full flex gap-1 object-contain justify-center"
                  >
                    <Button
                      type="button"
                      text="Change Password"
                      shape="rounded-small"
                      fitContent
                      onClick={() => {
                        setSelectedUser(user);
                        setShowPopUpChangePassword(true);
                      }}
                    />
                    <Button
                      type="button"
                      text="Detail"
                      shape="rounded-small"
                      fitContent
                      onClick={() => {
                        router.push(`/user-list/${user.ID}`);
                      }}
                    />
                    <div
                      className="w-7 lg:w-9 h-7 lg:h-9 text-[20px] md:text-[24px] lg:text-[28px] flex justify-center items-center rounded-[4px] text-white bg-red-600 hover:bg-red-secondary cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowPopUpDelete(true);
                      }}
                    >
                      <IoIosTrash />
                    </div>
                  </div>
                ),
              };
            })
        );
      }
    } catch (error) {
      toastError((error as any).response?.data?.error);
    }
  };

  useEffect(() => {
    getUser();
    getEmailAdmin();
  }, []);

  const handleDeleteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingButton(true);
    try {
      if (context.token && selectedUser?.ID) {
        const response = await deleteUser(
          `admin/${selectedUser?.ID}`,
          context.token
        );

        setShowPopUpDelete(false);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        (error as any).response?.data?.error || "Failed to delete user.";
      toastError(errorMessage);
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toastError("Passwords do not match");
      return;
    }

    try {
      setFormErrors({});
      const validationResult = schema.safeParse(registerData);

      if (validationResult.success) {
        await updateWithJson(
          "admin/user/" + selectedUser?.ID,
          {
            name: selectedUser?.name,
            phone: selectedUser?.phone,
            email: selectedUser?.email,
            password: registerData.password,
            confirm_password: registerData.confirm_password,
          },
          context.token!
        );
        toastSuccess("Update password successfully");
        setShowPopUpChangePassword(false);
      } else {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((error) => {
          const field = error.path[0];
          errors[field] = error.message;
        });
        setFormErrors(errors);
      }
    } catch (error) {
      toastError("Update password failed");
      console.log(error);
    }
  };

  const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setFormErrors({});
      const validationResult = schema.safeParse(registerData);

      if (context.token) {
        const response = await postWithCredentialsJson(
          "admin/register",
          {
            name: registerData.name,
            email: registerData.email,
            phone: registerData.phone,
            password: registerData.password,
            confirm_password: registerData.confirm_password,
            address: registerData.address,
            role: registerData.role,
          },
          context.token
        );
        toastSuccess("User successfully added");
        setShowPopUpAddUser(false);
      }
    } catch (error) {
      toastError("Add user failed");
      console.log(error);
    }
  };

  // paginate
  const indexOfLastUser = page * 10;
  const indexOfFirstUser = indexOfLastUser - 10;

  useEffect(() => {
    if (search != undefined && search != "") {
      const filtered = dataUser.filter((item: any) =>
        Object.values(item).some((value: any) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
      setDataTable(filtered.slice((page - 1) * 10, page * 10));
      setTotalPages(Math.ceil(filtered.length / 10));
    } else {
      setDataTable(dataUser.slice((page - 1) * 10, page * 10));
      setTotalPages(Math.ceil(dataUser.length / 10));
    }

    if (search != undefined && search != "") {
      const filtered = emailAdmin.filter((item: any) =>
        Object.values(item).some((value: any) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
      setDataTableEmail(filtered.slice((pageEmail - 1) * 10, pageEmail * 10));
      setTotalPagesEmail(Math.ceil(filtered.length / 10));
    } else {
      setDataTableEmail(emailAdmin.slice((pageEmail - 1) * 10, pageEmail * 10));
      setTotalPagesEmail(Math.ceil(dataUser.length / 10));
    }
    if (totalPages < page) {
      setPage(1);
    }

    if (totalPagesEmail < pageEmail) {
      setPageEmail(1);
    }
  }, [search, page, pageEmail, emailAdmin, dataUser]);

  return (
    <>
      <Modal
        visible={showPopUpChangePassword}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
        onClose={() => setShowPopUpChangePassword(false)}
      >
        <form
          onSubmit={(e) => handleUpdatePassword(e)}
          className="flex flex-col gap-5 lg:gap-7"
        >
          <Field
            id="password"
            type={"password"}
            placeholder={"Type your new password here"}
            useLabel
            labelText="Password"
            labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
            onChange={(e) => setRegisterData({ password: e.target.value })}
            invalidMessage={formErrors?.password}
          />
          <Field
            id="email"
            type={"password"}
            placeholder={"Type your password again"}
            useLabel
            labelText="Confirm Password"
            labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
            onChange={(e) =>
              setRegisterData({ confirm_password: e.target.value })
            }
            invalidMessage={formErrors?.confirm_password}
          />
          <div className="lg:col-start-2">
            <Button
              type={"submit"}
              text="Save"
              onClick={() => handleUpdatePassword}
            />
          </div>
        </form>
      </Modal>

      <Modal
        visible={showPopUpAddUser}
        width="w-[90%]"
        onClose={() => setShowPopUpAddUser(false)}
      >
        <form
          onSubmit={(e) => handleAddUser(e)}
          className="flex flex-col gap-5 lg:gap-7"
        >
          <div className=" flex flex-col lg:flex-row gap-5 lg:gap-7">
            <div className="flex flex-col gap-5 lg:gap-7 w-full lg:w-1/2">
              <Field
                id="name"
                type={"field"}
                placeholder={"Type your name here"}
                useLabel
                labelText="Name"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                onChange={(val) => setRegisterData({ name: val.target.value })}
                invalidMessage={formErrors?.name}
                required
              />
              <Field
                id="email"
                type={"email"}
                placeholder={"Type your email here"}
                useLabel
                labelText="Email"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                onChange={(val) => setRegisterData({ email: val.target.value })}
                invalidMessage={formErrors?.email}
                required
              />
              <Field
                id="password"
                type={"password"}
                placeholder={"Type your password here"}
                useLabel
                labelText="Password"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                onChange={(val) =>
                  setRegisterData({ password: val.target.value })
                }
                invalidMessage={formErrors?.password}
                required
              />
              <Field
                id="confirm"
                type={"password"}
                placeholder={"Type your password again"}
                useLabel
                labelText="Confirm Password"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                onChange={(val) =>
                  setRegisterData({ confirm_password: val.target.value })
                }
                invalidMessage={formErrors?.confirm_password}
                required
              />
            </div>
            <div className="w-full flex flex-col gap-5 lg:gap-7 lg:w-1/2">
              <Field
                id="number"
                type={"field"}
                placeholder={"Ex: 0811123939"}
                useLabel
                labelText="Telephone Number"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                onChange={(val) => setRegisterData({ phone: val.target.value })}
                invalidMessage={formErrors?.phone}
                required
              />
              <Field
                id="address"
                type={"area"}
                placeholder={"Type your address here"}
                useLabel
                labelText="Address"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                guideText="Ex: Jl. Gelap Nyawang no. 45, RT 5, RW 10, Lebak Gede, Coblong, Kota Bandung"
                guideStyle="text-gray-subtext text-[12px] font-medium font-poppins"
                onChangeArea={(val) =>
                  setRegisterData({ address: val.target.value })
                }
                invalidMessage={formErrors?.address}
                required
              />
              <Dropdown
                id="role"
                placeholder={"Role"}
                options={optionRole}
                useLabel
                label="Role"
                labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
                onChange={(val) => setRegisterData({ role: val?.value })}
                required
              />
            </div>
          </div>
          <div className="lg:col-start-2">
            <Button
              type={"submit"}
              text="Save"
              isLoading={isLoading}
              onClick={() => handleAddUser}
            />
          </div>
        </form>
      </Modal>
      <Modal
        visible={showPopUpEmailAdmin}
        onClose={() => setShowPopUpEmailAdmin(false)}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
      >
        <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px] mt-6">
          Email Admin
        </h1>
        <div className="w-full mt-8 flex flex-col gap-8 pb-[20px]">
          <Table data={dataTableEmail} header={headerEmailAdmin} isLoading={false} />
          {emailAdmin.length > 10 && (
            <Paginate
              totalPages={totalPagesEmail}
              current={(page: number) => setPageEmail(page)}
            />
          )}
        </div>
        <form 
          onSubmit={(e) => handleAddEmailAdmin(e)}
          className="w-full flex flex-col gap-3"
        >
          <Field
              placeholder={"Type here"}
              type={"email"}
              useLabel
              required
              labelStyle="text-dark-maintext font-poppins font-semibold text-[14px] lg:text-[18px]"
              labelText="Email"
              id="field6"
              onChange={(e) => setAddEmailAdmin(e.target.value)}
            />
            <Button type={"submit"} text="Add Email" />
        </form>
      </Modal>
      <Modal
        visible={showPopUpDelete}
        onClose={() => setShowPopUpDelete(false)}
        width="w-[90%] sm:w-[65%] md:w-[50%]"
      >
        <div className="flex items-center justify-center text-[40px] mx-auto w-20 h-20 rounded-full text-red-secondary border-2 border-red-secotext-red-secondary">
          <FiTrash2 />
        </div>
        <h3 className="text-[24px] md:text-[28px] lg:text-[32px] text-center text-red-secondary mt-5 font-poppins font-bold">
          Are you sure?
        </h3>
        <p className="text-center text-dark-maintext mt-3 font-poppins">
          Do you really want to delete this item? <br /> This action cannot be
          undone
        </p>
        <form
          onSubmit={(e) => handleDeleteUser(e)}
          className="w-full flex flex-col lg:flex-row gap-5 mt-5"
        >
          <div className="w-full lg:w-1/2">
            <Button
              type={"submit"}
              text="YES"
              color="red"
              isLoading={isLoadingButton}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <Button
              type={"button"}
              text="NO"
              onClick={() => setShowPopUpDelete(false)}
            />
          </div>
        </form>
      </Modal>

      <div className="w-full min-h-screen pb-[60px] pt-[108px] lg:pt-[40px] px-[4%] lg:px-[40px] xl:px-[80px] bg-white">
        <div className="flex flex-wrap gap-y-2 justify-between items-center">
          <h1 className="text-dark-maintext font-robotoSlab font-bold text-[32px] md:text-[40px] lg:text-[56px]">
            USER LIST
          </h1>
        </div>
        <div
          className="md:hidden fixed top-5 right-4 cursor-pointer text-[40px] hover:text-yellow-secondary text-white"
          style={{ zIndex: 51 }}
          onClick={() => setShowPopUpAddUser(true)}
        >
          <IoIosAdd />
        </div>
        <div className="flex flex-row justify-between mt-3 mb-3 items-center gap-3">
          <div className="w-[50%] md:w-1/3">
            <Field
              id="Search"
              type={"search"}
              placeholder={"Search"}
              labelStyle="text-dark-maintext font-semibold text-[14px] lg:text-[18px]"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              text="Email Admin"
              color="hollow"
              shape="normal"
              fitContent
              onClick={() => {
                setShowPopUpEmailAdmin(true);
              }}
            />
            <Button
              type="button"
              text="Add New User"
              color="hollow"
              shape="normal"
              fitContent={true}
              onClick={() => {
                setShowPopUpAddUser(true);
              }}
            />
          </div>
        </div>
        <div className="w-full mt-8 flex flex-col gap-8">
          <Table data={dataTable} header={header} isLoading={false} />
          {dataUser.length > 10 && (
            <Paginate
              totalPages={totalPages}
              current={(page: number) => setPage(page)}
            />
          )}
        </div>
      </div>
    </>
  );
}
