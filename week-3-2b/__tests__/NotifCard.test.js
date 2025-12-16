import { render } from "@testing-library/react-native"
import NotifCard from "../components/NotifCard"

const mockItem = {
    notificationId: 'notif-123',
    taskTitle: 'Task Reminder',
    body: "Set reminder for task",
    scheduledAt: new Date('2025-12-16T00:00:00Z')
}

describe('NotifCard Component', () => {
    it('correctly renders notifications data', () => {
        const tree = render(<NotifCard item={mockItem} cancel={jest.fn()} />).toJSON();

        expect(tree).toMatchSnapshot();
    })
})