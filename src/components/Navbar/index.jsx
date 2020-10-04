import React, { Component } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  FaDownload,
  FaGem,
  FaTasks,
  FaNewspaper,
  FaPhotoVideo,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export class Navbar extends Component {
  render() {
    return (
      <ProSidebar>
        <SidebarHeader></SidebarHeader>
        <SidebarContent>
          <Menu iconShape="square">
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
              <Link to="/news">ข่าวสาร</Link>
            </MenuItem>
            <MenuItem icon={<FaPhotoVideo />}>
              <Link to="/gallery">รูปภาพ</Link>
            </MenuItem>
            <MenuItem icon={<FaDownload />}>
              <Link to="/downloads">ดาวน์โหลด</Link>
            </MenuItem>
            <MenuItem icon={<FaTasks />}>
              <Link to="/asks">รายการสอบถาม</Link>
            </MenuItem>
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <Menu iconShape="square">
            <MenuItem icon={<FaSignOutAlt />}>
              <Link to="/logout">ออกจากระบบ</Link>
            </MenuItem>
          </Menu>
        </SidebarFooter>
      </ProSidebar>
    );
  }
}

export default Navbar;
