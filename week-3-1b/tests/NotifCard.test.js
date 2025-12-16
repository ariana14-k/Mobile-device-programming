import {render} from '@testing-library/react-native'
import NotifCard from '../components/NotifCard'

const mockItem = {
    notificationId: "notif-123",
    taskTitle: 'Task Reminder',
    body: 'Set reminder for specific task',
    scheduledAt: new Date('2025-12-15T00:00:00Z')
}

describe('NotifCard Snapshot', () => {
    it('renders correctly notification data', () => {
        const tree = render(<NotifCard item={mockItem} cancel={jest.fn()}/>).toJSON();

        expect(tree).toMatchSnapshot();
    })
})