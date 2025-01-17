import React from "react";
import PropTypes from "prop-types";
import User from "../User";
import LanguageSelector from "../LanguageSelector";
import SettingButton from "../SettingButton";
import NotifiButton from "../NotifiButton";
import HelpButton from "../HelpButton";
const UserAccountToolbarComponent = ({ onEditProfile }) => {
  return (
    <>
      <div className="user-account-toolbar">
        <NotifiButton />
        <HelpButton />
        <User onEditProfile={onEditProfile} />
        <SettingButton />
        <div className="language-box-main">
          <LanguageSelector />
        </div>
      </div>
    </>
  );
};

UserAccountToolbarComponent.propTypes = {
  onEditProfile: PropTypes.func,
};

const UserAccountToolbar = React.memo(UserAccountToolbarComponent);
export default UserAccountToolbar;
