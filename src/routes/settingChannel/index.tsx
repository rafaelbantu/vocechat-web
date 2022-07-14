import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import LeaveChannel from "../../common/component/LeaveChannel";
import StyledSettingContainer from "../../common/component/StyledSettingContainer";
import DeleteConfirmModal from "./DeleteConfirmModal";
import useNavs from "./navs";
import { useAppSelector } from "../../app/store";

let from: string = "";

export default function ChannelSetting() {
  const { cid = 0 } = useParams();
  const { loginUser, channel } = useAppSelector((store) => {
    return {
      loginUser: store.authData.user,
      channel: cid ? store.channels.byId[+cid] : undefined
    };
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const navs = useNavs(+cid);
  const flattenNavs = navs
    .map(({ items }) => {
      return items;
    })
    .flat();
  const navKey = searchParams.get("nav");
  from = from ? from : searchParams.get("f") || "/";
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const close = () => {
    navigate(from);
    from = "";
  };
  const toggleDeleteConfirm = () => {
    setDeleteConfirm((prev) => !prev);
  };
  const toggleLeaveConfirm = () => {
    setLeaveConfirm((prev) => !prev);
  };
  if (!cid) return null;
  const currNav = flattenNavs.find((n) => n.name == navKey) || flattenNavs[0];
  const canDelete = loginUser?.is_admin || channel?.owner == loginUser?.uid;
  const canLeave = !channel?.is_public;

  return (
    <>
      <StyledSettingContainer
        nav={currNav}
        closeModal={close}
        title="Channel Setting"
        navs={navs}
        dangers={[
          canLeave && {
            title: "Leave Channel",
            handler: toggleLeaveConfirm
          },
          canDelete && {
            title: "Delete Channel",
            handler: toggleDeleteConfirm
          }
        ]}
      >
        {currNav.component}
      </StyledSettingContainer>
      {deleteConfirm && <DeleteConfirmModal closeModal={toggleDeleteConfirm} id={+cid} />}
      {leaveConfirm && <LeaveChannel closeModal={toggleLeaveConfirm} id={+cid} />}
    </>
  );
}
