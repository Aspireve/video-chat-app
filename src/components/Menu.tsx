import { useMemo, useRef, useState } from "react";
import { useClassNames } from "../hooks/useClassNames";
import { useOutsideClick } from "../hooks/useOutsideClick";

import { useFirebaseAuth } from "./../hooks/useFirebaseAuth";
import { FaUser } from "react-icons/fa";

const Menu = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { user, logout } = useFirebaseAuth();
  const userInitials = useMemo(() => {
    const displayName = user?.providerData?.[0]?.displayName;
    if (displayName) {
      const names = displayName.split(" ");
      return names
        .map((name) => name.charAt(0))
        .join("")
        .substring(0, names.length == 1 ? 1 : 2);
    }
    return user?.email.substring(0, 2);
  }, [user]);
  const userPhotoUrl = useMemo(() => user?.providerData?.[0]?.photoURL, [user]);
  const menuRef = useRef();
  const classNames = useClassNames();

  const handleLogout = () => {
    logout();
  };

  const hideMenu = () => {
    setIsMenuVisible(false);
  };

  useOutsideClick(menuRef, hideMenu);

  return (
    <div
      ref={menuRef}
      className={classNames("menu", { active: isMenuVisible })}
    >
      <div
        className="menu-trigger"
        onClick={() => {
          setIsMenuVisible((visibleMenu) => !visibleMenu);
        }}
      >
        {userPhotoUrl ? (
          <div
            className="user-photo"
            style={{ backgroundImage: `url(${userPhotoUrl})` }}
          ></div>
        ) : (
          userInitials?.toUpperCase()
        )}
      </div>
      {isMenuVisible && (
        <div className="menu-body">
          <div className="menu-body_user">
            <div className="menu-body_user-photo">
              {userPhotoUrl ? (
                <div
                  className="user-photo"
                  style={{ backgroundImage: `url(${userPhotoUrl})` }}
                ></div>
              ) : (
                userInitials?.toUpperCase()
              )}
            </div>
            <div className="menu-body_user-name">{user?.displayName}</div>
            <div className="menu-body_user-email">{user?.email}</div>
          </div>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
export { Menu };
