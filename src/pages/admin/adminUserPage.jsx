import axios from "axios";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import Loading from "../../components/loading";

/*
=========================================================
VELMORA — CUSTOMER & ACCESS MANAGEMENT
=========================================================

Primary Violet   #6C5CE7
Soft Lavender    #B8A1FF
Soft Rose        #F2B8C6
Champagne        #EADBC8
Warm Ivory       #FAF9F7
Surface          #FFFFFF
Charcoal         #2F3136
Muted Text       #6B7280

Success          #4F9D7A
Warning          #D99A3E
Error            #D95C5C

Admin direction:
Quiet Luxury
Professional
Customer-focused
Structured
Mobile-first
=========================================================
*/

/* =========================================================
   ICONS
========================================================= */

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M4 4v6h6" />
      <path d="M20 20v-6h-6" />
      <path d="M5.6 15A7 7 0 0 0 18 18.4" />
      <path d="M18.4 9A7 7 0 0 0 6 5.6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.5-3.5 2.4-5 5.5-5s5 1.5 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5" />
      <path d="M16.5 14c2.5.4 3.7 2 4 5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 3 5 6v5c0 4.7 2.7 8 7 10 4.3-2 7-5.3 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.5-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 0 1 7.5-2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="8"
        width="11"
        height="11"
        rx="2"
      />

      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

/* =========================================================
   USER AVATAR
========================================================= */

function UserAvatar({
  user,
  size = "medium",
  getUserImage,
  getInitials,
  getUserName,
}) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const image =
    getUserImage(user);

  const sizeClass =
    size === "large"
      ? "h-16 w-16 rounded-[20px] text-lg"
      : size === "small"
      ? "h-10 w-10 rounded-xl text-xs"
      : "h-12 w-12 rounded-2xl text-sm";

  if (
    image &&
    !imageFailed
  ) {
    return (
      <div
        className={`
          ${sizeClass}

          shrink-0
          overflow-hidden

          border
          border-[#E5DDEE]

          bg-[#F4F0FF]

          shadow-sm
        `}
      >
        <img
          src={image}
          alt={`${getUserName(
            user
          )} profile`}
          className="
            h-full
            w-full
            object-cover
          "
          onError={() =>
            setImageFailed(
              true
            )
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeClass}

        flex
        shrink-0
        items-center
        justify-center

        bg-gradient-to-br
        from-[#6C5CE7]
        to-[#B8A1FF]

        font-extrabold
        text-white

        shadow-[0_8px_20px_rgba(108,92,231,0.18)]
      `}
    >
      {getInitials(user) ||
        "V"}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminUserPage() {
  const [
    users,
    setUsers,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] = useState("all");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    selectedUser,
    setSelectedUser,
  ] = useState(null);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    updatingUserId,
    setUpdatingUserId,
  ] = useState(null);

  /* =====================================================
     HELPERS
  ===================================================== */

  function getUserName(user) {
    const fullName =
      `${user?.firstName || ""} ${
        user?.lastName || ""
      }`.trim();

    return (
      fullName ||
      "Unknown Customer"
    );
  }

  function getUserId(user) {
    return (
      user?._id ||
      user?.userId ||
      "-"
    );
  }

  function getUserRole(user) {
    return (
      user?.role ||
      "customer"
    );
  }

  function getUserImage(user) {
    return (
      user?.img || ""
    );
  }

  function getInitials(user) {
    return getUserName(user)
      .split(" ")
      .slice(0, 2)
      .map((name) =>
        name
          .charAt(0)
          .toUpperCase()
      )
      .join("");
  }

  function getRoleStyle(role) {
    if (
      role === "admin"
    ) {
      return "border-[#DFD3F7] bg-[#F3EEFF] text-[#6C5CE7]";
    }

    return "border-[#F1DCE3] bg-[#FFF3F7] text-[#B46079]";
  }

  function getStatusStyle(
    isBlocked
  ) {
    if (isBlocked) {
      return "border-[#F0D4D9] bg-[#FFF1F3] text-[#B45462]";
    }

    return "border-[#D5E9DF] bg-[#EDF7F2] text-[#478465]";
  }

  /* =====================================================
     FETCH USERS
  ===================================================== */

  async function fetchUsers(
    showSuccess = false
  ) {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      toast.error(
        "Please sign in first"
      );

      setIsLoading(false);

      setIsRefreshing(
        false
      );

      return;
    }

    try {
      const res =
        await axios.get(
          import.meta.env
            .VITE_BACKEND_URL +
            "/api/user",

          {
            headers: {
              Authorization:
                "Bearer " +
                token,
            },
          }
        );

      const userList =
        Array.isArray(
          res.data
        )
          ? res.data
          : res.data?.users ||
            res.data?.data ||
            [];

      setUsers(
        userList
      );

      if (showSuccess) {
        toast.success(
          "Velmora accounts refreshed"
        );
      }
    } catch (error) {
      console.error(
        "GET USERS ERROR:",
        error.response
          ?.data ||
          error
      );

      toast.error(
        error.response
          ?.data
          ?.message ||
          "Failed to load Velmora accounts"
      );
    } finally {
      setIsLoading(false);

      setIsRefreshing(
        false
      );
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =====================================================
     REFRESH
  ===================================================== */

  async function refreshUsers() {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(
      true
    );

    await fetchUsers(
      true
    );
  }

  /* =====================================================
     BLOCK / UNBLOCK
  ===================================================== */

  async function toggleBlockUser(
    user
  ) {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      toast.error(
        "Please sign in first"
      );

      return;
    }

    const newBlockStatus =
      !user.isBlock;

    const action =
      newBlockStatus
        ? "block"
        : "restore access for";

    const confirmed =
      window.confirm(
        `Are you sure you want to ${action} ${getUserName(
          user
        )}?`
      );

    if (!confirmed) {
      return;
    }

    const userId =
      getUserId(user);

    setUpdatingUserId(
      userId
    );

    try {
      await axios.put(
        import.meta.env
          .VITE_BACKEND_URL +
          "/api/user/" +
          userId +
          "/block",

        {
          isBlock:
            newBlockStatus,
        },

        {
          headers: {
            Authorization:
              "Bearer " +
              token,
          },
        }
      );

      /* Update table/cards */

      setUsers(
        (
          previousUsers
        ) =>
          previousUsers.map(
            (item) =>
              getUserId(
                item
              ) === userId
                ? {
                    ...item,

                    isBlock:
                      newBlockStatus,
                  }
                : item
          )
      );

      /* Update modal */

      setSelectedUser(
        (previous) => {
          if (
            !previous ||
            getUserId(
              previous
            ) !== userId
          ) {
            return previous;
          }

          return {
            ...previous,

            isBlock:
              newBlockStatus,
          };
        }
      );

      toast.success(
        newBlockStatus
          ? "Velmora account blocked"
          : "Velmora account access restored"
      );
    } catch (error) {
      console.error(
        "BLOCK USER ERROR:",
        error
      );

      toast.error(
        error.response
          ?.data
          ?.message ||
          "Failed to update account access"
      );
    } finally {
      setUpdatingUserId(
        null
      );
    }
  }

  /* =====================================================
     ESCAPE
  ===================================================== */

  useEffect(() => {
    function handleEscape(
      event
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setSelectedUser(
          null
        );
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

  /* =====================================================
     LOCK BODY
  ===================================================== */

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

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredUsers =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          /*
            Lowercase here is
            comparison only.
            Stored email casing
            is NOT modified.
          */

          const name =
            getUserName(
              user
            ).toLowerCase();

          const email =
            String(
              user.email ||
                ""
            ).toLowerCase();

          const userId =
            String(
              getUserId(
                user
              )
            ).toLowerCase();

          const role =
            getUserRole(
              user
            ).toLowerCase();

          const matchesSearch =
            searchValue ===
              "" ||
            name.includes(
              searchValue
            ) ||
            email.includes(
              searchValue
            ) ||
            userId.includes(
              searchValue
            );

          const matchesRole =
            roleFilter ===
              "all" ||
            role ===
              roleFilter;

          const matchesStatus =
            statusFilter ===
              "all" ||
            (statusFilter ===
              "enabled" &&
              !user.isBlock) ||
            (statusFilter ===
              "blocked" &&
              user.isBlock);

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        }
      );
    }, [
      users,
      search,
      roleFilter,
      statusFilter,
    ]);

  /* =====================================================
     COUNTS
  ===================================================== */

  const accessEnabledUsers =
    users.filter(
      (user) =>
        !user.isBlock
    ).length;

  const blockedUsers =
    users.filter(
      (user) =>
        user.isBlock
    ).length;

  const adminUsers =
    users.filter(
      (user) =>
        getUserRole(
          user
        ) === "admin"
    ).length;

  const customerUsers =
    users.filter(
      (user) =>
        getUserRole(
          user
        ) !== "admin"
    ).length;

  /* =====================================================
     COPY
  ===================================================== */

  async function copyText(
    text,
    message
  ) {
    try {
      await navigator.clipboard.writeText(
        text
      );

      toast.success(
        message
      );
    } catch {
      toast.error(
        "Unable to copy"
      );
    }
  }

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  function clearFilters() {
    setSearch("");

    setRoleFilter(
      "all"
    );

    setStatusFilter(
      "all"
    );
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <Loading
        message="Preparing Velmora customer accounts..."
        fullScreen={false}
      />
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div
      className="
        relative

        min-h-screen
        w-full

        overflow-x-hidden

        bg-[#FAF9F7]

        p-3

        sm:p-5

        lg:p-7

        xl:p-8

        animate-[velmoraUserPageEnter_0.4s_ease-out]
      "
    >
      {/* BACKGROUND LIGHT */}

      <div
        className="
          pointer-events-none

          absolute
          -left-36
          -top-28

          h-[380px]
          w-[380px]

          rounded-full

          bg-[#B8A1FF]/8

          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none

          absolute
          -right-40
          top-[520px]

          h-[420px]
          w-[420px]

          rounded-full

          bg-[#F2B8C6]/7

          blur-[130px]
        "
      />

      <div
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-[1500px]
        "
      >
        {/* =================================================
            USER DETAILS MODAL
        ================================================= */}

        {selectedUser && (
          <div
            onClick={() =>
              setSelectedUser(
                null
              )
            }
            className="
              fixed
              inset-0
              z-[9999]

              flex
              items-center
              justify-center

              bg-[#29222F]/65

              p-3

              backdrop-blur-md

              sm:p-5
            "
          >
            <div
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
              role="dialog"
              aria-modal="true"
              aria-label="Velmora account details"
              className="
                w-full
                max-w-[640px]

                max-h-[92dvh]
                overflow-y-auto

                rounded-[26px]

                border
                border-[#E8E1EF]

                bg-white

                shadow-[0_35px_100px_rgba(33,25,45,0.30)]

                animate-[velmoraUserModalEnter_0.25s_ease-out]

                sm:rounded-[30px]
              "
            >
              {/* HEADER */}

              <div
                className="
                  sticky
                  top-0
                  z-20

                  border-b
                  border-[#EEE9F2]

                  bg-white/95

                  px-4
                  py-4

                  backdrop-blur-xl

                  sm:px-6
                  sm:py-5
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                    "
                  >
                    <UserAvatar
                      user={
                        selectedUser
                      }
                      size="large"
                      getUserImage={
                        getUserImage
                      }
                      getInitials={
                        getInitials
                      }
                      getUserName={
                        getUserName
                      }
                    />

                    <div className="min-w-0">
                      <p
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.16em]

                          text-[#927CE4]
                        "
                      >
                        Velmora
                        Account
                      </p>

                      <h2
                        className="
                          mt-1
                          truncate

                          text-lg
                          font-extrabold
                          tracking-[-0.025em]

                          text-[#2F3136]

                          sm:text-xl
                        "
                      >
                        {getUserName(
                          selectedUser
                        )}
                      </h2>

                      <div
                        className="
                          mt-2

                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >
                        <span
                          className={`
                            rounded-full

                            border

                            px-2.5
                            py-1

                            text-[9px]
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
                            rounded-full

                            border

                            px-2.5
                            py-1

                            text-[9px]
                            font-bold

                            ${getStatusStyle(
                              selectedUser.isBlock
                            )}
                          `}
                        >
                          {selectedUser.isBlock
                            ? "Blocked"
                            : "Access Enabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Close account details"
                    onClick={() =>
                      setSelectedUser(
                        null
                      )
                    }
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      border
                      border-[#E8E2EC]

                      bg-[#FAF8FB]

                      text-[#77707C]

                      transition-all

                      hover:border-[#E7C6CE]
                      hover:bg-[#FFF2F4]
                      hover:text-[#B65566]

                      active:scale-90
                    "
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              {/* CONTENT */}

              <div
                className="
                  space-y-5

                  p-4

                  sm:p-6
                "
              >
                {/* ACCOUNT SUMMARY */}

                <div
                  className="
                    relative
                    overflow-hidden

                    rounded-[22px]

                    border
                    border-[#E5DDF1]

                    bg-gradient-to-br
                    from-[#F7F4FF]
                    via-white
                    to-[#FFF5F8]

                    p-5
                  "
                >
                  <div
                    className="
                      pointer-events-none

                      absolute
                      -right-14
                      -top-14

                      h-36
                      w-36

                      rounded-full

                      bg-[#B8A1FF]/16

                      blur-3xl
                    "
                  />

                  <div
                    className="
                      relative

                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center

                        rounded-2xl

                        bg-[#F2EDFF]

                        text-[#6C5CE7]
                      "
                    >
                      <ShieldIcon />
                    </div>

                    <div>
                      <p
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.15em]

                          text-[#927CE4]
                        "
                      >
                        Access
                        Management
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          font-extrabold
                          text-[#39333E]
                        "
                      >
                        {selectedUser.isBlock
                          ? "Account access is currently restricted."
                          : "Account access is currently enabled."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DETAILS */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                  "
                >
                  <DetailCard
                    title="Full Name"
                    value={getUserName(
                      selectedUser
                    )}
                  />

                  <DetailCard
                    title="Account Role"
                    value={getUserRole(
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

                  {/* ID intentionally only in modal */}

                  <DetailCard
                    title="Internal User ID"
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
                </div>

                {/* ACCESS CONTROL */}

                <section
                  className="
                    rounded-[22px]

                    border
                    border-[#E8E1EF]

                    bg-white

                    p-4

                    shadow-[0_8px_25px_rgba(63,48,84,0.035)]

                    sm:p-5
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-4

                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.16em]

                          text-[#927CE4]
                        "
                      >
                        Account
                        Security
                      </p>

                      <h3
                        className="
                          mt-1

                          font-extrabold
                          text-[#39333E]
                        "
                      >
                        Access
                        Status
                      </h3>

                      <div
                        className="
                          mt-2

                          flex
                          items-center
                          gap-2
                        "
                      >
                        <span
                          className={`
                            h-2.5
                            w-2.5

                            rounded-full

                            ${
                              selectedUser.isBlock
                                ? "bg-[#D95C5C]"
                                : "bg-[#4F9D7A]"
                            }
                          `}
                        />

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-[#625B67]
                          "
                        >
                          {selectedUser.isBlock
                            ? "Blocked"
                            : "Access Enabled"}
                        </span>
                      </div>
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
                        flex
                        min-h-[46px]
                        w-full
                        items-center
                        justify-center
                        gap-2

                        rounded-xl

                        border

                        px-4

                        text-xs
                        font-bold

                        transition-all

                        active:scale-[0.98]

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        sm:w-auto

                        ${
                          selectedUser.isBlock
                            ? "border-[#D1E6DA] bg-[#EDF7F2] text-[#478465] hover:bg-[#4F9D7A] hover:text-white"
                            : "border-[#F0D4D9] bg-[#FFF1F3] text-[#B45462] hover:bg-[#B45462] hover:text-white"
                        }
                      `}
                    >
                      {updatingUserId ===
                      getUserId(
                        selectedUser
                      ) ? (
                        <>
                          <span
                            className="
                              h-4
                              w-4
                              animate-spin

                              rounded-full

                              border-2
                              border-current/25
                              border-t-current
                            "
                          />

                          Updating...
                        </>
                      ) : selectedUser.isBlock ? (
                        <>
                          <UnlockIcon />

                          Restore Access
                        </>
                      ) : (
                        <>
                          <LockIcon />

                          Block Account
                        </>
                      )}
                    </button>
                  </div>
                </section>
              </div>

              {/* FOOTER */}

              <div
                className="
                  border-t
                  border-[#EEE9F2]

                  bg-[#FCFAFD]

                  px-4
                  py-4

                  text-center

                  sm:px-6
                "
              >
                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.13em]

                    text-[#A39BA6]
                  "
                >
                  Velmora Account
                  Administration
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            relative

            mb-5

            overflow-hidden

            rounded-[26px]

            border
            border-[#E9E2F0]

            bg-gradient-to-r
            from-[#F5F1FF]
            via-white
            to-[#FFF3F7]

            p-5

            shadow-[0_16px_50px_rgba(63,48,84,0.05)]

            sm:mb-6
            sm:rounded-[30px]
            sm:p-6
          "
        >
          <div
            className="
              pointer-events-none

              absolute
              -right-20
              -top-20

              h-52
              w-52

              rounded-full

              bg-[#B8A1FF]/14

              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none

              absolute
              -bottom-24
              left-[35%]

              h-44
              w-44

              rounded-full

              bg-[#F2B8C6]/10

              blur-3xl
            "
          />

          <div
            className="
              relative

              flex
              flex-col
              gap-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-[#DED5F4]

                  bg-white/75

                  px-3
                  py-1.5

                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#6C5CE7]

                  sm:text-[10px]
                "
              >
                <span className="text-[#B9955B]">
                  ✦
                </span>

                Velmora
                Customer
                Management
              </div>

              <h1
                className="
                  mt-3

                  text-2xl
                  font-extrabold
                  tracking-[-0.04em]

                  text-[#2F3136]

                  sm:text-3xl

                  lg:text-[34px]
                "
              >
                Customer
                Accounts
              </h1>

              <p
                className="
                  mt-2

                  max-w-2xl

                  text-xs
                  leading-6

                  text-[#78717D]

                  sm:text-sm
                "
              >
                Review Velmora
                customer and
                administrator
                accounts,
                manage access
                permissions and
                maintain a
                secure shopping
                community.
              </p>
            </div>

            <button
              type="button"
              onClick={
                refreshUsers
              }
              disabled={
                isRefreshing
              }
              className="
                group

                flex
                min-h-[46px]
                w-full
                items-center
                justify-center
                gap-2

                rounded-xl

                border
                border-[#DAD1EC]

                bg-white

                px-4

                text-sm
                font-bold
                text-[#625A68]

                shadow-sm

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:border-[#C8B9F2]
                hover:text-[#6C5CE7]
                hover:shadow-md

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:w-auto
              "
            >
              <span
                className={`
                  ${
                    isRefreshing
                      ? "animate-spin"
                      : "transition-transform duration-500 group-hover:rotate-180"
                  }
                `}
              >
                <RefreshIcon />
              </span>

              {isRefreshing
                ? "Refreshing..."
                : "Refresh Accounts"}
            </button>
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section
          className="
            mb-5

            grid
            grid-cols-2
            gap-3

            lg:grid-cols-4
            lg:gap-4
          "
        >
          <UserStatCard
            title="Total Accounts"
            value={
              users.length
            }
            type="total"
          />

          <UserStatCard
            title="Access Enabled"
            value={
              accessEnabledUsers
            }
            type="enabled"
          />

          <UserStatCard
            title="Blocked"
            value={
              blockedUsers
            }
            type="blocked"
          />

          <UserStatCard
            title="Administrators"
            value={
              adminUsers
            }
            type="admin"
          />
        </section>

        {/* =================================================
            ACCOUNT MIX
        ================================================= */}

        <div
          className="
            mb-5

            flex
            flex-col
            gap-3

            rounded-[20px]

            border
            border-[#E7E0EC]

            bg-white

            px-4
            py-3.5

            shadow-[0_9px_28px_rgba(63,48,84,0.03)]

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.16em]

                text-[#927CE4]
              "
            >
              Account Mix
            </p>

            <p
              className="
                mt-1
                text-xs
                text-[#817A85]
              "
            >
              {
                customerUsers
              }{" "}
              customer
              {customerUsers ===
              1
                ? ""
                : "s"}{" "}
              and{" "}
              {
                adminUsers
              }{" "}
              administrator
              {adminUsers === 1
                ? ""
                : "s"}{" "}
              are registered.
            </p>
          </div>

          <span
            className="
              self-start

              rounded-full

              border
              border-[#DFD6F1]

              bg-[#F6F2FF]

              px-3
              py-1.5

              text-[9px]
              font-bold
              uppercase
              tracking-[0.11em]

              text-[#6C5CE7]

              sm:self-auto
            "
          >
            Velmora Community
          </span>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <section
          className="
            mb-5

            rounded-[24px]

            border
            border-[#E9E3EF]

            bg-white

            p-4

            shadow-[0_12px_38px_rgba(63,48,84,0.04)]

            sm:p-5
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-3

              md:grid-cols-[minmax(0,1fr)_180px_190px]
            "
          >
            {/* SEARCH */}

            <div className="relative">
              <div
                className="
                  pointer-events-none

                  absolute
                  left-3
                  top-1/2

                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center

                  rounded-xl

                  bg-[#F2EDFF]

                  text-[#6C5CE7]
                "
              >
                <SearchIcon />
              </div>

              <input
                type="text"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search name, email or internal user ID..."
                className="
                  min-h-[52px]
                  w-full

                  rounded-2xl

                  border
                  border-[#DDD7E2]

                  bg-white

                  pl-[58px]
                  pr-12

                  text-sm
                  text-[#39333E]

                  outline-none

                  transition-all
                  duration-300

                  placeholder:text-[#AAA3AF]

                  hover:border-[#CFC5D8]

                  focus:border-[#B8A1FF]
                  focus:ring-4
                  focus:ring-[#B8A1FF]/15
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                  className="
                    absolute
                    right-3
                    top-1/2

                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center

                    rounded-full

                    text-[#9A929E]

                    transition-colors

                    hover:bg-[#F2EDFF]
                    hover:text-[#6C5CE7]
                  "
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            {/* ROLE */}

            <select
              value={
                roleFilter
              }
              onChange={(
                event
              ) =>
                setRoleFilter(
                  event.target
                    .value
                )
              }
              className="
                min-h-[52px]
                w-full

                rounded-2xl

                border
                border-[#DDD7E2]

                bg-white

                px-4

                text-sm
                font-semibold
                text-[#625B67]

                outline-none

                transition-all

                focus:border-[#B8A1FF]
                focus:ring-4
                focus:ring-[#B8A1FF]/15
              "
            >
              <option value="all">
                All Roles
              </option>

              <option value="customer">
                Customers
              </option>

              <option value="admin">
                Administrators
              </option>
            </select>

            {/* STATUS */}

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target
                    .value
                )
              }
              className="
                min-h-[52px]
                w-full

                rounded-2xl

                border
                border-[#DDD7E2]

                bg-white

                px-4

                text-sm
                font-semibold
                text-[#625B67]

                outline-none

                transition-all

                focus:border-[#B8A1FF]
                focus:ring-4
                focus:ring-[#B8A1FF]/15
              "
            >
              <option value="all">
                All Access
              </option>

              <option value="enabled">
                Access Enabled
              </option>

              <option value="blocked">
                Blocked
              </option>
            </select>
          </div>

          <div
            className="
              mt-3

              flex
              flex-col
              gap-2

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                text-[10px]
                text-[#99919D]

                sm:text-xs
              "
            >
              Showing{" "}
              <span
                className="
                  font-bold
                  text-[#6C5CE7]
                "
              >
                {
                  filteredUsers.length
                }
              </span>{" "}
              of{" "}
              {
                users.length
              }{" "}
              Velmora accounts
            </p>

            {(search ||
              roleFilter !==
                "all" ||
              statusFilter !==
                "all") && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="
                  self-start

                  text-xs
                  font-bold
                  text-[#6C5CE7]

                  transition-colors

                  hover:text-[#5544C5]
                  hover:underline

                  sm:self-auto
                "
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {/* =================================================
            USER LIST
        ================================================= */}

        <section
          className="
            overflow-hidden

            rounded-[26px]

            border
            border-[#E9E3EF]

            bg-white

            shadow-[0_15px_48px_rgba(63,48,84,0.045)]
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-3

              border-b
              border-[#EEE9F2]

              px-4
              py-4

              sm:px-6
              sm:py-5
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.17em]

                  text-[#927CE4]
                "
              >
                Velmora
                Community
              </p>

              <h2
                className="
                  mt-1

                  text-base
                  font-extrabold
                  text-[#2F3136]

                  sm:text-lg
                "
              >
                Customer &
                Admin Accounts
              </h2>

              <p
                className="
                  mt-1

                  text-[10px]
                  text-[#99919D]

                  sm:text-xs
                "
              >
                Select an
                account to
                inspect complete
                information and
                manage access.
              </p>
            </div>

            <span
              className="
                flex
                h-9
                min-w-[38px]
                items-center
                justify-center

                rounded-full

                border
                border-[#E0D7F3]

                bg-[#F5F1FF]

                px-3

                text-xs
                font-bold
                text-[#6C5CE7]
              "
            >
              {
                filteredUsers.length
              }
            </span>
          </div>

          {/* DESKTOP HEADER */}

          <div
            className="
              hidden

              grid-cols-[1.2fr_1.5fr_125px_145px_160px_40px]
              gap-4

              border-b
              border-[#EAE4EE]

              bg-[#F8F5FB]

              px-6
              py-4

              text-[10px]
              font-black
              uppercase
              tracking-[0.08em]
              text-[#827A87]

              xl:grid
            "
          >
            <div>
              Account
            </div>

            <div>
              Email
            </div>

            <div>
              Role
            </div>

            <div>
              Access
            </div>

            <div>
              Action
            </div>

            <div />
          </div>

          {/* USERS */}

          <div
            className="
              divide-y
              divide-[#F0EBF3]
            "
          >
            {filteredUsers.map(
              (user) => {
                const userId =
                  getUserId(
                    user
                  );

                return (
                  <article
                    key={
                      userId
                    }
                    onClick={() =>
                      setSelectedUser(
                        user
                      )
                    }
                    className="
                      group

                      cursor-pointer

                      transition-all
                      duration-200

                      hover:bg-[#FCFAFD]
                    "
                  >
                    {/* =================================
                        MOBILE / TABLET
                    ================================= */}

                    <div
                      className="
                        p-4

                        sm:p-5

                        xl:hidden
                      "
                    >
                      {/* TOP */}

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
                            min-w-0
                            items-center
                            gap-3
                          "
                        >
                          <UserAvatar
                            user={user}
                            getUserImage={
                              getUserImage
                            }
                            getInitials={
                              getInitials
                            }
                            getUserName={
                              getUserName
                            }
                          />

                          <div className="min-w-0">
                            <h3
                              className="
                                truncate

                                font-extrabold
                                text-[#39333E]
                              "
                            >
                              {getUserName(
                                user
                              )}
                            </h3>

                            <p
                              className="
                                mt-1
                                truncate

                                text-sm
                                text-[#817A85]
                              "
                            >
                              {user.email ||
                                "-"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`
                            shrink-0

                            rounded-full

                            border

                            px-2.5
                            py-1

                            text-[9px]
                            font-bold

                            ${getStatusStyle(
                              user.isBlock
                            )}
                          `}
                        >
                          {user.isBlock
                            ? "Blocked"
                            : "Enabled"}
                        </span>
                      </div>

                      {/* ROLE + ACCESS */}

                      <div
                        className="
                          mt-4

                          flex
                          flex-col
                          gap-3

                          border-t
                          border-[#EEE9F2]

                          pt-3

                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >
                        <span
                          className={`
                            self-start

                            rounded-full

                            border

                            px-3
                            py-1.5

                            text-[10px]
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

                        <div
                          className="
                            flex
                            w-full
                            gap-2

                            sm:w-auto
                          "
                        >
                          <button
                            type="button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              setSelectedUser(
                                user
                              );
                            }}
                            className="
                              flex
                              min-h-[42px]
                              flex-1
                              items-center
                              justify-center
                              gap-2

                              rounded-xl

                              border
                              border-[#DDD5F2]

                              bg-[#F4F0FF]

                              px-4

                              text-xs
                              font-bold
                              text-[#6C5CE7]

                              transition-all

                              hover:bg-[#ECE5FF]

                              sm:flex-none
                            "
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingUserId ===
                              userId
                            }
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();

                              toggleBlockUser(
                                user
                              );
                            }}
                            className={`
                              flex
                              min-h-[42px]
                              flex-1
                              items-center
                              justify-center
                              gap-2

                              rounded-xl

                              border

                              px-4

                              text-xs
                              font-bold

                              transition-all

                              active:scale-[0.98]

                              disabled:cursor-not-allowed
                              disabled:opacity-50

                              sm:flex-none

                              ${
                                user.isBlock
                                  ? "border-[#D5E9DF] bg-[#EDF7F2] text-[#478465] hover:bg-[#4F9D7A] hover:text-white"
                                  : "border-[#F0D6DB] bg-[#FFF3F5] text-[#B45462] hover:bg-[#B45462] hover:text-white"
                              }
                            `}
                          >
                            {updatingUserId ===
                            userId ? (
                              <>
                                <span
                                  className="
                                    h-4
                                    w-4
                                    animate-spin

                                    rounded-full

                                    border-2
                                    border-current/30
                                    border-t-current
                                  "
                                />

                                Updating
                              </>
                            ) : user.isBlock ? (
                              <>
                                <UnlockIcon />

                                Restore
                              </>
                            ) : (
                              <>
                                <LockIcon />

                                Block
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* =================================
                        DESKTOP
                    ================================= */}

                    <div
                      className="
                        hidden

                        grid-cols-[1.2fr_1.5fr_125px_145px_160px_40px]
                        items-center
                        gap-4

                        px-6
                        py-5

                        xl:grid
                      "
                    >
                      {/* USER */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-3
                        "
                      >
                        <UserAvatar
                          user={user}
                          size="small"
                          getUserImage={
                            getUserImage
                          }
                          getInitials={
                            getInitials
                          }
                          getUserName={
                            getUserName
                          }
                        />

                        <p
                          className="
                            truncate

                            text-sm
                            font-bold
                            text-[#39333E]
                          "
                        >
                          {getUserName(
                            user
                          )}
                        </p>
                      </div>

                      {/* EMAIL */}

                      <p
                        className="
                          truncate

                          text-sm
                          text-[#69626E]
                        "
                        title={
                          user.email
                        }
                      >
                        {user.email ||
                          "-"}
                      </p>

                      {/* ROLE */}

                      <div>
                        <span
                          className={`
                            inline-flex

                            rounded-full

                            border

                            px-3
                            py-1.5

                            text-[10px]
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

                      {/* ACCESS */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <span
                          className={`
                            h-2
                            w-2

                            rounded-full

                            ${
                              user.isBlock
                                ? "bg-[#D95C5C]"
                                : "bg-[#4F9D7A]"
                            }
                          `}
                        />

                        <span
                          className="
                            text-xs
                            font-semibold
                            text-[#625B67]
                          "
                        >
                          {user.isBlock
                            ? "Blocked"
                            : "Enabled"}
                        </span>
                      </div>

                      {/* ACTION */}

                      <button
                        type="button"
                        disabled={
                          updatingUserId ===
                          userId
                        }
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          toggleBlockUser(
                            user
                          );
                        }}
                        className={`
                          flex
                          min-h-[38px]
                          items-center
                          justify-center
                          gap-1.5

                          rounded-xl

                          border

                          px-3

                          text-[10px]
                          font-bold

                          transition-all

                          disabled:cursor-not-allowed
                          disabled:opacity-50

                          ${
                            user.isBlock
                              ? "border-[#D5E9DF] bg-[#EDF7F2] text-[#478465] hover:bg-[#4F9D7A] hover:text-white"
                              : "border-[#F0D6DB] bg-[#FFF3F5] text-[#B45462] hover:bg-[#B45462] hover:text-white"
                          }
                        `}
                      >
                        {updatingUserId ===
                        userId ? (
                          <>
                            <span
                              className="
                                h-3.5
                                w-3.5
                                animate-spin

                                rounded-full

                                border-2
                                border-current/30
                                border-t-current
                              "
                            />

                            Updating
                          </>
                        ) : user.isBlock ? (
                          <>
                            <UnlockIcon />

                            Restore
                          </>
                        ) : (
                          <>
                            <LockIcon />

                            Block
                          </>
                        )}
                      </button>

                      {/* ARROW */}

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center

                          rounded-full

                          text-[#C1BAC5]

                          transition-all

                          group-hover:translate-x-1
                          group-hover:bg-[#F2EDFF]
                          group-hover:text-[#6C5CE7]
                        "
                      >
                        <ArrowIcon />
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>

          {/* EMPTY */}

          {filteredUsers.length ===
            0 && (
            <div
              className="
                px-5
                py-14

                text-center

                sm:py-20
              "
            >
              <div
                className="
                  mx-auto

                  flex
                  h-16
                  w-16
                  items-center
                  justify-center

                  rounded-[20px]

                  border
                  border-[#E2D9F4]

                  bg-[#F5F1FF]

                  text-[#6C5CE7]
                "
              >
                <UsersIcon />
              </div>

              <p
                className="
                  mt-4

                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]

                  text-[#927CE4]
                "
              >
                Velmora
                Community
              </p>

              <h3
                className="
                  mt-2

                  text-lg
                  font-extrabold
                  text-[#39333E]
                "
              >
                No accounts
                found.
              </h3>

              <p
                className="
                  mx-auto
                  mt-2

                  max-w-sm

                  text-sm
                  leading-6
                  text-[#918996]
                "
              >
                No Velmora
                customer or
                administrator
                account matches
                the selected
                search and
                filters.
              </p>

              {(search ||
                roleFilter !==
                  "all" ||
                statusFilter !==
                  "all") && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="
                    mt-5

                    min-h-[44px]

                    rounded-xl

                    bg-gradient-to-r
                    from-[#6C5CE7]
                    to-[#8F78EA]

                    px-5

                    text-sm
                    font-bold
                    text-white

                    shadow-[0_9px_22px_rgba(108,92,231,0.20)]

                    transition-all

                    hover:-translate-y-0.5
                    hover:shadow-[0_13px_28px_rgba(108,92,231,0.28)]

                    active:scale-[0.98]
                  "
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </section>

        {/* =================================================
            ANIMATION
        ================================================= */}

        <style>{`
          @keyframes velmoraUserPageEnter {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes velmoraUserModalEnter {
            from {
              opacity: 0;
              transform: scale(0.97) translateY(10px);
            }

            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-\\[velmoraUserPageEnter_0\\.4s_ease-out\\],
            .animate-\\[velmoraUserModalEnter_0\\.25s_ease-out\\] {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function UserStatCard({
  title,
  value,
  type,
}) {
  const styles = {
    total: {
      card:
        "border-[#E0D7F5] bg-[#F7F4FF]",

      icon:
        "bg-[#6C5CE7] text-white",
    },

    enabled: {
      card:
        "border-[#D7EADF] bg-[#F2F9F5]",

      icon:
        "bg-[#DCEFE5] text-[#478465]",
    },

    blocked: {
      card:
        "border-[#F0D6DB] bg-[#FFF4F5]",

      icon:
        "bg-[#F9DCE1] text-[#B45462]",
    },

    admin: {
      card:
        "border-[#EDDFC6] bg-[#FFF9EF]",

      icon:
        "bg-[#F4E6CC] text-[#A47837]",
    },
  };

  const current =
    styles[type] ||
    styles.total;

  return (
    <div
      className={`
        rounded-[20px]

        border

        p-3.5

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:shadow-md

        sm:p-4

        ${current.card}
      `}
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <p
          className="
            text-[9px]
            font-semibold
            leading-4
            text-[#7D7581]

            sm:text-xs
          "
        >
          {title}
        </p>

        <div
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center

            rounded-xl

            ${current.icon}
          `}
        >
          <UsersIcon />
        </div>
      </div>

      <p
        className="
          mt-3

          text-lg
          font-extrabold
          tracking-[-0.025em]

          text-[#39333E]

          sm:text-xl
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL CARD
========================================================= */

function DetailCard({
  title,
  value,
  buttonText,
  onButtonClick,
}) {
  return (
    <div
      className="
        min-w-0

        rounded-2xl

        border
        border-[#EAE4EF]

        bg-[#FCFAFD]

        p-4

        transition-all

        hover:border-[#DED4EF]
        hover:bg-white
        hover:shadow-sm
      "
    >
      <p
        className="
          text-[9px]
          font-black
          uppercase
          tracking-[0.12em]

          text-[#9A929E]
        "
      >
        {title}
      </p>

      <div
        className="
          mt-2

          flex
          items-start
          justify-between
          gap-3
        "
      >
        <p
          className="
            min-w-0

            break-all

            text-sm
            font-semibold
            leading-6

            text-[#514A56]
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
                flex
                min-h-[34px]
                shrink-0
                items-center
                justify-center
                gap-1.5

                rounded-lg

                border
                border-[#DFD6F3]

                bg-[#F4F0FF]

                px-2.5

                text-[10px]
                font-bold
                text-[#6C5CE7]

                transition-all

                hover:bg-[#EDE6FF]

                active:scale-95
              "
            >
              <CopyIcon />

              {buttonText}
            </button>
          )}
      </div>
    </div>
  );
}