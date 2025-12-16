import React from "react";
import { render } from "@testing-library/react-native";
import NotifCard from "../components/NotifCard"
const mockItem = {
  taskTitle: "Finish assignment",
  body: "Complete snapshot testing section",
  notificationId: "notif-123",
  scheduledAt: new Date("2025-12-13T15:00:00Z"),
};

describe("NotifCard Snapshot", () => {
  it("renders correctly with notification data", () => {
    const tree = render(
      <NotifCard item={mockItem} cancel={jest.fn()} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
