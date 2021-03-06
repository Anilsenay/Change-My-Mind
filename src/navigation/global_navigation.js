import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "../screens/login.screen";
import Welcome from "../screens/welcome.screen";
import Feed from "../screens/feed.screen";
import Explore from "../screens/explore.screen";
import Notifications from "../screens/notification.screen";
import Profile from "../screens/profile.screen";
import Create from "../screens/create.screen";
import MyProfile from "../screens/my_profile.screen";
import EditProfile from "../screens/edit_profile.screen";
import Settings from "../screens/settings.screen";

import Root from "../index";
import { MyTabBar } from "./tabBar";
import Discussion from "../screens/discussion";
import Favourites from "../screens/favourites.screen";

const Stack = createStackNavigator();

export function GlobalNavigation() {
  return (
    <Stack.Navigator animation="fade">
      <Stack.Screen
        name="Root"
        component={Root}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Feed"
        component={TabScreens}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Create"
        component={Create}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Discussion"
        component={Discussion}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favourites"
        component={Favourites}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const TabScreens = ({ ...props }) => {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      {/* tabBar={(props) => <MyTabBar {...props} />} */}
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Create" component={Feed} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="MyProfile" component={MyProfile} />
    </Tab.Navigator>
  );
};
