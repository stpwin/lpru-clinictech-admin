import React, { Component } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  FaDownload,
  FaGem,
  FaTasks,
  FaNewspaper,
  FaPhotoVideo,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { firebaseAuthContext } from "../../providers/AuthProvider";
export class Navbar extends Component {
  handleSignOut = () => {
    this.context.Signout();
  };
  render() {
    return (
      <ProSidebar>
        <SidebarHeader></SidebarHeader>
        <SidebarContent>
          <Menu iconShape="square">
            {this.props.isLoggedIn ? (
              <>
                <MenuItem icon={<FaGem />}>
                  <Link to="/">ข้อมูลเว็บไซต์</Link>
                </MenuItem>
                <SubMenu title="ข้อมูลผู้เชี่ยวชาญ" icon={<FaUser />}>
                  <MenuItem>
                    <Link to="/specialist">จัดการข้อมูล</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/specialist/owner">จัดการข้อมูลเจ้าของ</Link>
                  </MenuItem>
                </SubMenu>
                <MenuItem icon={<FaNewspaper />}>
                  <Link to="/news">ข่าวประชาสัมพันธ์</Link>
                </MenuItem>
                <MenuItem icon={<FaPhotoVideo />}>
                  <Link to="/gallery">แกลเลอรี</Link>
                </MenuItem>
                <MenuItem icon={<FaDownload />}>
                  <Link to="/downloads">ดาวน์โหลด</Link>
                </MenuItem>
                <MenuItem icon={<FaTasks />}>
                  <Link to="/asks">รายการสอบถาม</Link>
                </MenuItem>
              </>
            ) : null}
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <Menu iconShape="square">
            {this.props.isLoggedIn ? (
              <>
                <MenuItem icon={<FaSignOutAlt />}>
                  <span onClick={() => this.handleSignOut()}>ออกจากระบบ</span>
                  {/* <Link to="/asks">รายการสอบถาม</Link> */}
                  {/* <Button onClick={() => this.handleSignOut()}>ออกจากระบบ</Button> */}
                </MenuItem>
              </>
            ) : null}
          </Menu>
        </SidebarFooter>
      </ProSidebar>
    );
  }
}
Navbar.contextType = firebaseAuthContext;
export default Navbar;
