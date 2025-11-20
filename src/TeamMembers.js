import React from 'react';

import sheinPhoto from './photomembers/shein.jpg';
import kyawPhoto from './photomembers/kyaw.jpg';
import minPhoto from './photomembers/min.jpg';
import TextType from './animate/TextType';
import TargetCursor from './animate/TargetCursor';


function TeamMembers() {
  const teamMembers = [
    {
      id: 1,
      name: "Shein",
      role: "Full Stack Developer",
      description: "Responsible for developing and training the CNN model for digit recognition.",
      photo: sheinPhoto,
      github: "https://github.com/Htooauntsheinzzz",
      linkedin: "https://www.linkedin.com/in/htoo-aunt-shein-b06311260/",
      email: "htooauntsheinz@gmail.com"
    },
    {
      id: 2,
      name: "Kyaw Zaw Hein",
      role: "Data Analyst",
      description: "Collect and preprocess the MNIST dataset for model training and evaluation.",
      photo: kyawPhoto,
      github: "https://github.com/kyawzawhein",
      linkedin: "https://linkedin.com/in/kyawzawhein",
      email: "kyaw@example.com"
    },
    {
      id: 3,
      name: "Min Pyae Sone",
      role: "Application Tester",
      description: "Test the web application to ensure functionality and user experience.",
      photo: minPhoto,
      github: "https://github.com/minpyaesone",
      linkedin: "https://linkedin.com/in/minpyaesone",
      email: "min@example.com"
    }
  ];

  return (
    <div className="team-page">
      <TargetCursor
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
        />
      <div className="team-header">
        <TextType
            text={["Meet Our Team", "Creative more with us", "Building the Future of AI"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="_"
            className="team-header-text"
          />
        <p>The talented individuals behind the AI Digit Recognition project</p>
      </div>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-card">
            <div className="card-glow"></div>
            <div className="member-avatar">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {member.avatar}
                </div>
              )}
            </div>
            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <span className="member-role">{member.role}</span>
              <p className="member-description">{member.description}</p>
            </div>
            <div className="card-actions">
              <a href={member.github} target="_blank" rel="noopener noreferrer" className="action-btn github-btn cursor-target" title="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="action-btn linkedin-btn cursor-target" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href={`mailto:${member.email}`} className="action-btn email-btn cursor-target" title="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="team-stats">
        <div className="stat-item">
          <div className="stat-number">3</div>
          <div className="stat-label">Team Members</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">9+</div>
          <div className="stat-label">Technologies</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">1</div>
          <div className="stat-label">Amazing Project</div>
        </div>
      </div>
    </div>
  );
}

export default TeamMembers;
