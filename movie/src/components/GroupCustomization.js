import React from 'react';
import AddMovie from './AddMovie'; // Assuming you have this component
import AddSchedule from './AddSchedule'; // Assuming you have this component
import './GroupStyles.css'; // Import the styles

const GroupCustomization = ({ groupId }) => {
    return (
        <div className="group-section">
            <h2>Customize Group Page</h2>
            <h3>Add Movie</h3>
            <AddMovie groupId={groupId} /> {/* Pass groupId if needed */}
            <h3>Add Schedule</h3>
            <AddSchedule groupId={groupId} /> {/* Pass groupId if needed */}
        </div>
    );
};

export default GroupCustomization;