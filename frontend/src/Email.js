import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Email.css';

const Email = () => {
    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [templates, setTemplates] = useState(['template.txt', 'template1.txt', 'template2.txt']);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [isMultiple, setIsMultiple] = useState(false);
    // const [email, setEmail] = useState('');
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [emailPassword, setEmailPassword] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []);
    
    // useEffect(() => {
    //     const userEmail = localStorage.getItem('email');
    //     setEmail(userEmail);
    // }, []);

    useEffect(() => {
        if (selectedTemplate) {
            axios.get(`http://localhost:5000/templates/${selectedTemplate}`)
                .then(response => setText(response.data.content))
                .catch(error => console.error('Error fetching template:', error));
        }
    }, [selectedTemplate]);

    const handleSendEmail = async () => {
        if (!showPasswordInput) {
            setShowPasswordInput(true);
            return;
        }
        const formData = new FormData();
        // formData.append('from', email);
        formData.append('to', to);
        formData.append('cc', cc);
        formData.append('subject', subject);
        formData.append('text', text);
        formData.append('isMultiple', isMultiple);
        formData.append('emailPassword', emailPassword);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        const token = localStorage.getItem('token');
        console.log('FormData before sending:', formData);

        try {
            const response = await axios.post('http://localhost:5000/send-email', formData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response from server:', response.data);
            alert('Email sent successfully');
            setShowPasswordInput(false);
            setEmailPassword('');
        } catch (error) {
            console.error('Error sending email:', error.response ? error.response.data : error);
            alert('Error sending email. Please try again.');
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        window.location.href = '/login';
    };

    return (
        <div className="email-form-container">
            <h2>Send Email</h2>
            <div className="form-group">
                <label>Template:</label>
                <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)}>
                    <option value="">Select a template</option>
                    {templates.map(template => (
                        <option key={template} value={template}>{template}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Recipients:</label>
                <div>
                    <input type="radio" checked={!isMultiple} onChange={() => setIsMultiple(false)} /> Single
                    <input type="radio" checked={isMultiple} onChange={() => setIsMultiple(true)} /> Multiple
                </div>
                <input
                    type="email"
                    placeholder="To"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                />
                {isMultiple && <small>Enter multiple emails separated by commas</small>}
            </div>
            <div className="form-group">
                <label>CC:</label>
                <input
                    type="email"
                    placeholder="CC"
                    value={cc}
                    onChange={e => setCc(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Subject:</label>
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Message:</label>
                <textarea
                    placeholder="Message"
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Attachment:</label>
                <input
                    type="file"
                    onChange={e => setAttachment(e.target.files[0])}
                />
            </div>
            <div className="form-group">
            {showPasswordInput && (
                    <input
                        type="password"
                        placeholder="Email Password"
                        value={emailPassword}
                        onChange={e => setEmailPassword(e.target.value)}
                    />
                )}
            </div>
           
            <button onClick={handleSendEmail}>Send Email</button>
            <div className="user-info">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
        </div>
    );
};

export default Email;
