import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/loading";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [updatingUserId, setUpdatingUserId] =
    useState(null);

  // =====================================================
  // HELPERS
  // =====================================================

  function getUserName(user) {
    const fullName = `${user.firstName || ""} ${
      user.lastName || ""
    }`.trim();

    return fullName || "Unknown User";
  }

  function getUserId(user) {
    return user._id || user.userId || "-";
  }

  function getUserRole(user) {
    return user.role || "customer";
  }

  function getUserImage(user) {
    return user.img || "";
  }

  function getInitials(user) {
    return getUserName(user)
      .split(" ")
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  }

  // =====================================================
  // ROLE STYLE
  // =====================================================

  function getRoleStyle(role) {
    if (role === "admin") {
      return "bg-purple-100 text-purple-700 border-purple-200";
    }

    return "bg-blue-100 text-blue-700 border-blue-200";
  }

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      setIsLoading(false);
      return;
    }

    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
          "/api/user",
        {
          headers: {
            Authorization:
              "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log("USERS:", res.data);

        const userList = Array.isArray(res.data)
          ? res.data
          : res.data.users ||
            res.data.data ||
            [];

        setUsers(userList);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "GET USERS ERROR:",
          error.response?.data || error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load users"
        );

        setIsLoading(false);
      });
  }, []);

  // =====================================================
  // REFRESH USERS
  // =====================================================

  async function refreshUsers() {
    const token =
      localStorage.getItem("token");

    if (!token || isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    try {
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL +
          "/api/user",
        {
          headers: {
            Authorization:
              "Bearer " + token,
          },
        }
      );

      const userList = Array.isArray(
        res.data
      )
        ? res.data
        : res.data.users ||
          res.data.data ||
          [];

      setUsers(userList);

      toast.success("Users refreshed");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to refresh users"
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  // =====================================================
  // BLOCK / UNBLOCK USER
  // =====================================================

  async function toggleBlockUser(user) {
    const token =
      localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    const newBlockStatus =
      !user.isBlock;

    const action =
      newBlockStatus
        ? "block"
        : "unblock";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${getUserName(
        user
      )}?`
    );

    if (!confirmed) {
      return;
    }

    setUpdatingUserId(getUserId(user));

    try {
      await axios.put(
        import.meta.env.VITE_BACKEND_URL +
          "/api/user/" +
          getUserId(user) +
          "/block",
        {
          isBlock: newBlockStatus,
        },
        {
          headers: {
            Authorization:
              "Bearer " + token,
          },
        }
      );

      // Update users list immediately

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          getUserId(item) ===
          getUserId(user)
            ? {
                ...item,
                isBlock:
                  newBlockStatus,
              }
            : item
        )
      );

      // Update selected modal user

      setSelectedUser((previous) => {
        if (
          !previous ||
          getUserId(previous) !==
            getUserId(user)
        ) {
          return previous;
        }

        return {
          ...previous,
          isBlock: newBlockStatus,
        };
      });

      toast.success(
        newBlockStatus
          ? "User blocked successfully"
          : "User unblocked successfully"
      );
    } catch (error) {
      console.error(
        "BLOCK USER ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update user status"
      );
    } finally {
      setUpdatingUserId(null);
    }
  }

  // =====================================================
  // CLOSE MODAL WITH ESC
  // =====================================================

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setSelectedUser(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // PREVENT BODY SCROLL
  // =====================================================

  useEffect(() => {
    if (selectedUser) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [selectedUser]);

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const name =
        getUserName(user).toLowerCase();

      const email = (
        user.email || ""
      ).toLowerCase();

      const userId = String(
        getUserId(user)
      ).toLowerCase();

      const role =
        getUserRole(user).toLowerCase();

      // ID hidden in UI but still searchable

      const matchesSearch =
        searchValue === "" ||
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        userId.includes(searchValue);

      const matchesRole =
        roleFilter === "all" ||
        role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          !user.isBlock) ||
        (statusFilter === "blocked" &&
          user.isBlock);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // =====================================================
  // COUNTS
  // =====================================================

  const activeUsers =
    users.filter(
      (user) => !user.isBlock
    ).length;

  const blockedUsers =
    users.filter(
      (user) => user.isBlock
    ).length;

  const adminUsers =
    users.filter(
      (user) =>
        getUserRole(user) === "admin"
    ).length;

  // =====================================================
  // COPY
  // =====================================================

  async function copyText(
    text,
    message
  ) {
    try {
      await navigator.clipboard.writeText(
        text
      );

      toast.success(message);
    } catch {
      toast.error("Unable to copy");
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className="
        w-full
        min-h-screen

        bg-[#F8F9FA]

        p-3
        sm:p-5
        md:p-8

        overflow-x-hidden

        animate-[pageEnter_0.4s_ease-out]
      "
    >
      {/* =================================================
          USER DETAILS MODAL
      ================================================= */}

      {selectedUser && (
        <div
          onClick={() =>
            setSelectedUser(null)
          }
          className="
            fixed
            inset-0
            z-[9999]

            bg-black/50
            backdrop-blur-sm

            flex
            items-center
            justify-center

            p-3
            sm:p-5
          "
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              w-full
              max-w-lg

              max-h-[90vh]
              overflow-y-auto

              bg-white

              rounded-2xl
              sm:rounded-3xl

              shadow-2xl

              animate-[modalEnter_0.25s_ease-out]
            "
          >
            {/* Header */}

            <div
              className="
                sticky
                top-0
                z-10

                bg-white/95
                backdrop-blur-md

                border-b
                border-gray-100

                p-4
                sm:p-6

                flex
                items-center
                justify-between

                gap-3
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3

                  min-w-0
                "
              >
                {/* Image */}

                <div
                  className="
                    w-14
                    h-14

                    shrink-0

                    rounded-2xl

                    overflow-hidden

                    bg-purple-100

                    shadow-sm
                  "
                >
                  {getUserImage(
                    selectedUser
                  ) ? (
                    <img
                      src={getUserImage(
                        selectedUser
                      )}
                      alt={getUserName(
                        selectedUser
                      )}
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div
                      className="
                        w-full
                        h-full

                        flex
                        items-center
                        justify-center

                        text-purple-700

                        font-bold
                      "
                    >
                      {getInitials(
                        selectedUser
                      )}
                    </div>
                  )}
                </div>

                <div className="min-w-0">

                  <h2
                    className="
                      text-lg
                      sm:text-xl

                      font-bold
                      text-[#393E46]

                      truncate
                    "
                  >
                    {getUserName(
                      selectedUser
                    )}
                  </h2>

                  <div
                    className="
                      flex
                      items-center
                      gap-2

                      mt-1
                    "
                  >
                    <span
                      className={`
                        px-2.5
                        py-1

                        rounded-full

                        border

                        text-[11px]
                        font-bold
                        capitalize

                        ${getRoleStyle(
                          getUserRole(
                            selectedUser
                          )
                        )}
                      `}
                    >
                      {getUserRole(
                        selectedUser
                      )}
                    </span>

                    <span
                      className={`
                        px-2.5
                        py-1

                        rounded-full

                        text-[11px]
                        font-bold

                        ${
                          selectedUser.isBlock
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                    >
                      {selectedUser.isBlock
                        ? "Blocked"
                        : "Active"}
                    </span>

                  </div>

                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="
                  w-9
                  h-9

                  shrink-0

                  rounded-full

                  bg-gray-100
                  text-gray-500

                  flex
                  items-center
                  justify-center

                  hover:bg-red-50
                  hover:text-red-500

                  active:scale-90

                  transition-all
                "
              >
                ✕
              </button>
            </div>

            {/* Details */}

            <div
              className="
                p-4
                sm:p-6

                space-y-4
              "
            >
              {/* Hidden ID only here */}

              <DetailCard
                title="User ID"
                value={getUserId(
                  selectedUser
                )}
                buttonText="Copy"
                onButtonClick={() =>
                  copyText(
                    getUserId(
                      selectedUser
                    ),
                    "User ID copied"
                  )
                }
              />

              <DetailCard
                title="Full Name"
                value={getUserName(
                  selectedUser
                )}
              />

              <DetailCard
                title="Email Address"
                value={
                  selectedUser.email ||
                  "-"
                }
                buttonText="Copy"
                onButtonClick={() =>
                  copyText(
                    selectedUser.email ||
                      "",
                    "Email copied"
                  )
                }
              />

              {/* Account Status */}

              <div
                className="
                  p-4

                  rounded-xl

                  border
                  border-gray-100

                  bg-gray-50
                "
              >
                <p
                  className="
                    text-xs
                    text-gray-400
                    mb-2
                  "
                >
                  Account Status
                </p>

                <div
                  className="
                    flex
                    items-center
                    justify-between

                    gap-3
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className={`
                        w-2.5
                        h-2.5

                        rounded-full

                        ${
                          selectedUser.isBlock
                            ? "bg-red-500"
                            : "bg-green-500"
                        }
                      `}
                    />

                    <span
                      className="
                        font-semibold
                        text-[#393E46]
                      "
                    >
                      {selectedUser.isBlock
                        ? "Blocked"
                        : "Active"}
                    </span>

                  </div>

                  <button
                    type="button"
                    disabled={
                      updatingUserId ===
                      getUserId(
                        selectedUser
                      )
                    }
                    onClick={() =>
                      toggleBlockUser(
                        selectedUser
                      )
                    }
                    className={`
                      px-4
                      py-2

                      rounded-lg

                      text-xs
                      font-bold

                      transition-all

                      active:scale-95

                      disabled:opacity-50

                      ${
                        selectedUser.isBlock
                          ? `
                            bg-green-600
                            text-white
                            hover:bg-green-700
                          `
                          : `
                            bg-red-600
                            text-white
                            hover:bg-red-700
                          `
                      }
                    `}
                  >
                    {updatingUserId ===
                    getUserId(
                      selectedUser
                    )
                      ? "Updating..."
                      : selectedUser.isBlock
                      ? "Unblock User"
                      : "Block User"}
                  </button>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          sm:flex-row

          sm:items-center
          sm:justify-between

          gap-4

          mb-6
        "
      >
        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-[0.15em]

              font-bold
              text-gray-400
            "
          >
            User Management
          </p>

          <h1
            className="
              text-2xl
              sm:text-3xl

              font-bold
              text-[#393E46]

              mt-1
            "
          >
            Users
          </h1>

          <p
            className="
              text-sm
              text-gray-500

              mt-1
            "
          >
            Manage customer accounts and access.
          </p>

        </div>

        <button
          type="button"
          onClick={refreshUsers}
          disabled={isRefreshing}
          className="
            group

            w-full
            sm:w-auto

            px-4
            py-2.5

            rounded-xl

            bg-white

            border
            border-gray-200

            shadow-sm

            flex
            items-center
            justify-center
            gap-2

            text-sm
            font-semibold
            text-gray-600

            hover:text-purple-600
            hover:border-purple-300
            hover:shadow-md

            active:scale-[0.97]

            disabled:opacity-50

            transition-all
          "
        >
          <svg
            className={`
              w-4 h-4

              ${
                isRefreshing
                  ? "animate-spin"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v6h6M20 20v-6h-6M5.64 15A7 7 0 0018 18.36M18.36 9A7 7 0 006 5.64"
            />
          </svg>

          {isRefreshing
            ? "Refreshing..."
            : "Refresh Users"}
        </button>
      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-4

          gap-3
          sm:gap-4

          mb-5
        "
      >
        <StatCard
          title="Total Users"
          value={users.length}
        />

        <StatCard
          title="Active"
          value={activeUsers}
        />

        <StatCard
          title="Blocked"
          value={blockedUsers}
        />

        <StatCard
          title="Admins"
          value={adminUsers}
        />
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div
        className="
          bg-white

          border
          border-gray-100

          rounded-2xl

          shadow-sm

          p-4
          sm:p-5

          mb-5
        "
      >
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-[1fr_180px_180px]

            gap-3
          "
        >
          {/* Search */}

          <div className="relative">

            <svg
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2

                w-5
                h-5

                text-gray-400
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search name, email or user ID..."
              className="
                w-full

                pl-12
                pr-4
                py-3

                rounded-xl

                border
                border-gray-300

                outline-none

                text-sm

                focus:ring-2
                focus:ring-purple-100
                focus:border-purple-400

                transition-all
              "
            />
          </div>

          {/* Role */}

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(
                e.target.value
              )
            }
            className="
              px-4
              py-3

              rounded-xl

              border
              border-gray-300

              bg-white

              text-sm
              font-semibold

              outline-none
            "
          >
            <option value="all">
              All Roles
            </option>

            <option value="customer">
              Customers
            </option>

            <option value="admin">
              Admins
            </option>
          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="
              px-4
              py-3

              rounded-xl

              border
              border-gray-300

              bg-white

              text-sm
              font-semibold

              outline-none
            "
          >
            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="blocked">
              Blocked
            </option>
          </select>

        </div>

        <div
          className="
            flex
            items-center
            justify-between

            gap-3

            mt-3
          "
        >

          <p className="text-xs text-gray-400">
            Showing {filteredUsers.length} of{" "}
            {users.length} users
          </p>

          {(search ||
            roleFilter !== "all" ||
            statusFilter !==
              "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
                setStatusFilter(
                  "all"
                );
              }}
              className="
                text-xs
                font-semibold
                text-purple-600

                hover:text-purple-800
              "
            >
              Clear Filters
            </button>
          )}

        </div>
      </div>

      {/* =================================================
          USER LIST
      ================================================= */}

      <div
        className="
          bg-white

          rounded-2xl

          border
          border-gray-100

          shadow-sm

          overflow-hidden
        "
      >

        {/* Header */}

        <div
          className="
            px-4
            sm:px-6

            py-4
            sm:py-5

            border-b
            border-gray-100

            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                font-bold
                text-[#393E46]
              "
            >
              User Accounts
            </h2>

            <p
              className="
                text-xs
                text-gray-400

                mt-1
              "
            >
              Click a user to view full details.
            </p>

          </div>

          <div
            className="
              h-9

              min-w-[36px]

              px-3

              rounded-full

              bg-purple-50
              text-purple-600

              flex
              items-center
              justify-center

              font-bold
              text-xs
            "
          >
            {filteredUsers.length}
          </div>

        </div>

        {/* Desktop headings */}

        <div
          className="
            hidden
            xl:grid

            grid-cols-[1.2fr_1.5fr_120px_120px_150px_45px]

            gap-4

            px-6
            py-4

            bg-gray-50

            border-b
            border-gray-100

            text-xs
            font-bold
            uppercase
            tracking-wider
            text-gray-500
          "
        >
          <div>User</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Action</div>
          <div></div>
        </div>

        {/* Users */}

        <div className="divide-y divide-gray-100">

          {filteredUsers.map(
            (user) => (
              <div
                key={getUserId(user)}
                onClick={() =>
                  setSelectedUser(user)
                }
                className="
                  group

                  cursor-pointer

                  hover:bg-purple-50/30

                  transition-all
                  duration-200
                "
              >

                {/* =============================
                    MOBILE / TABLET
                ============================= */}

                <div
                  className="
                    xl:hidden

                    p-4
                    sm:p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between

                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3

                        min-w-0
                      "
                    >

                      {/* Avatar */}

                      <div
                        className="
                          w-12
                          h-12

                          shrink-0

                          rounded-xl

                          overflow-hidden

                          bg-purple-100
                        "
                      >
                        {getUserImage(
                          user
                        ) ? (
                          <img
                            src={getUserImage(
                              user
                            )}
                            alt={getUserName(
                              user
                            )}
                            className="
                              w-full
                              h-full
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              w-full
                              h-full

                              flex
                              items-center
                              justify-center

                              font-bold
                              text-purple-700
                            "
                          >
                            {getInitials(
                              user
                            )}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">

                        <h3
                          className="
                            font-bold
                            text-[#393E46]

                            truncate
                          "
                        >
                          {getUserName(
                            user
                          )}
                        </h3>

                        <p
                          className="
                            text-sm
                            text-gray-500

                            truncate
                          "
                        >
                          {user.email}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`
                        shrink-0

                        px-2.5
                        py-1

                        rounded-full

                        text-[10px]
                        font-bold

                        ${
                          user.isBlock
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                    >
                      {user.isBlock
                        ? "Blocked"
                        : "Active"}
                    </span>

                  </div>

                  {/* Bottom */}

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row

                      sm:items-center
                      sm:justify-between

                      gap-3

                      mt-4
                      pt-3

                      border-t
                      border-gray-100
                    "
                  >

                    <span
                      className={`
                        self-start

                        px-3
                        py-1

                        rounded-full

                        border

                        text-xs
                        font-bold
                        capitalize

                        ${getRoleStyle(
                          getUserRole(
                            user
                          )
                        )}
                      `}
                    >
                      {getUserRole(
                        user
                      )}
                    </span>

                    {/* Block button */}

                    <button
                      type="button"
                      disabled={
                        updatingUserId ===
                        getUserId(
                          user
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation();

                        toggleBlockUser(
                          user
                        );
                      }}
                      className={`
                        w-full
                        sm:w-auto

                        px-4
                        py-2

                        rounded-lg

                        text-xs
                        font-bold

                        active:scale-95

                        disabled:opacity-50

                        transition-all

                        ${
                          user.isBlock
                            ? `
                              bg-green-100
                              text-green-700
                              hover:bg-green-600
                              hover:text-white
                            `
                            : `
                              bg-red-100
                              text-red-700
                              hover:bg-red-600
                              hover:text-white
                            `
                        }
                      `}
                    >
                      {updatingUserId ===
                      getUserId(
                        user
                      )
                        ? "Updating..."
                        : user.isBlock
                        ? "Unblock User"
                        : "Block User"}
                    </button>

                  </div>

                </div>

                {/* =============================
                    DESKTOP
                ============================= */}

                <div
                  className="
                    hidden
                    xl:grid

                    grid-cols-[1.2fr_1.5fr_120px_120px_150px_45px]

                    gap-4

                    px-6
                    py-5

                    items-center
                  "
                >

                  {/* User */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3

                      min-w-0
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10

                        shrink-0

                        rounded-xl

                        overflow-hidden

                        bg-purple-100
                      "
                    >
                      {getUserImage(
                        user
                      ) ? (
                        <img
                          src={getUserImage(
                            user
                          )}
                          alt=""
                          className="
                            w-full
                            h-full
                            object-cover
                          "
                        />
                      ) : (
                        <div
                          className="
                            w-full
                            h-full

                            flex
                            items-center
                            justify-center

                            text-xs
                            font-bold
                            text-purple-700
                          "
                        >
                          {getInitials(
                            user
                          )}
                        </div>
                      )}
                    </div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-[#393E46]

                        truncate
                      "
                    >
                      {getUserName(
                        user
                      )}
                    </p>

                  </div>

                  {/* Email */}

                  <p
                    className="
                      text-sm
                      text-gray-500

                      truncate
                    "
                  >
                    {user.email}
                  </p>

                  {/* Role */}

                  <div>

                    <span
                      className={`
                        px-3
                        py-1

                        rounded-full

                        border

                        text-xs
                        font-bold
                        capitalize

                        ${getRoleStyle(
                          getUserRole(
                            user
                          )
                        )}
                      `}
                    >
                      {getUserRole(
                        user
                      )}
                    </span>

                  </div>

                  {/* Status */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <span
                      className={`
                        w-2
                        h-2

                        rounded-full

                        ${
                          user.isBlock
                            ? "bg-red-500"
                            : "bg-green-500"
                        }
                      `}
                    />

                    <span
                      className="
                        text-xs
                        font-semibold
                      "
                    >
                      {user.isBlock
                        ? "Blocked"
                        : "Active"}
                    </span>

                  </div>

                  {/* Button */}

                  <button
                    type="button"
                    disabled={
                      updatingUserId ===
                      getUserId(
                        user
                      )
                    }
                    onClick={(e) => {
                      e.stopPropagation();

                      toggleBlockUser(
                        user
                      );
                    }}
                    className={`
                      px-4
                      py-2

                      rounded-lg

                      text-xs
                      font-bold

                      active:scale-95

                      transition-all

                      disabled:opacity-50

                      ${
                        user.isBlock
                          ? `
                            bg-green-100
                            text-green-700
                            hover:bg-green-600
                            hover:text-white
                          `
                          : `
                            bg-red-100
                            text-red-700
                            hover:bg-red-600
                            hover:text-white
                          `
                      }
                    `}
                  >
                    {updatingUserId ===
                    getUserId(
                      user
                    )
                      ? "Updating..."
                      : user.isBlock
                      ? "Unblock"
                      : "Block"}
                  </button>

                  {/* Arrow */}

                  <svg
                    className="
                      w-5
                      h-5

                      text-gray-300

                      group-hover:text-purple-600
                      group-hover:translate-x-1

                      transition-all
                    "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>

                </div>

              </div>
            )
          )}

        </div>

        {/* Empty */}

        {filteredUsers.length === 0 && (
          <div
            className="
              py-16

              px-5

              text-center
            "
          >
            <h3
              className="
                text-lg
                font-bold
                text-[#393E46]
              "
            >
              No users found
            </h3>

            <p
              className="
                text-sm
                text-gray-400

                mt-1
              "
            >
              Try changing the search or filters.
            </p>
          </div>
        )}

      </div>

      <style>
        {`
          @keyframes pageEnter {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes modalEnter {
            from {
              opacity: 0;
              transform: scale(0.96) translateY(10px);
            }

            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  title,
  value,
}) {
  return (
    <div
      className="
        bg-white

        border
        border-gray-100

        rounded-2xl

        p-4
        sm:p-5

        shadow-sm

        transition-all
        duration-300

        hover:shadow-md
        hover:-translate-y-1
      "
    >

      <p
        className="
          text-xs
          sm:text-sm
          text-gray-400
        "
      >
        {title}
      </p>

      <p
        className="
          text-2xl
          sm:text-3xl

          font-bold
          text-[#393E46]

          mt-1
        "
      >
        {value}
      </p>

    </div>
  );
}

// =========================================================
// DETAIL CARD
// =========================================================

function DetailCard({
  title,
  value,
  buttonText,
  onButtonClick,
}) {
  return (
    <div
      className="
        p-4

        rounded-xl

        bg-gray-50

        border
        border-gray-100
      "
    >

      <p
        className="
          text-xs
          text-gray-400

          mb-1
        "
      >
        {title}
      </p>

      <div
        className="
          flex
          items-center
          justify-between

          gap-3
        "
      >

        <p
          className="
            text-sm
            font-semibold
            text-[#393E46]

            break-all
          "
        >
          {value}
        </p>

        {buttonText &&
          onButtonClick && (
            <button
              type="button"
              onClick={
                onButtonClick
              }
              className="
                shrink-0

                px-2.5
                py-1

                rounded-lg

                bg-purple-50
                text-purple-600

                text-xs
                font-semibold

                hover:bg-purple-100

                active:scale-95

                transition-all
              "
            >
              {buttonText}
            </button>
          )}

      </div>

    </div>
  );
}