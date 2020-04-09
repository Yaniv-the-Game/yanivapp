import React from 'react'
import Avatar from '../components/avatar'

export default function Players({
  profiles,
  hands,
  currentProfileId,
  myProfileId,
}: {
  profiles: { id: string, name: string, avatar: string }[],
  hands: { [profileId: string]: string[] },
  currentProfileId: string,
  myProfileId: string,
}) {

// below will be replaced with profile data
const name = ['Pascal','David','Ladina','Andrea'];
  const currentAvatar = ['muesli','avocado','cookie','waffle'];
  const currentMood = 'good';

  return (
    <div className='header'>
      {profiles.map((profile) => (
        <div className='profile'>
          <div className='cardIndicators'>
            {hands[profile.id] && hands[profile.id].map(card => (
              <div className='cardIndicator'>&nbsp;</div>
            ))}
          </div>
          <div className="avatar">
            <div className="avatarBackground" />
            <div className="avatarForeground">
              <Avatar name={profile.avatar} mood={currentMood} size={56} />
            </div>
          </div>
          <div>
            <p>{profile.name}</p>
            {currentProfileId === profile.id && (
              <div className='activeUser'></div>
            )}
          </div>
        </div>
      ))}
      {currentProfileId === myProfileId && (
        <div className='yourTurn'></div>
      )}
      <style jsx>{`
        p{
          margin:0px;
          color:#FFF;
        }
        .header {
          background: #A9C3A6;
          width: 100%;
          text-align:center;
          padding-top:15px;
          overflow: auto;
          white-space: nowrap;
        }
        .cardIndicators{
          margin:0;
        }
        .cardIndicator {
          background: #FFFFFF;
          min-width: 6px;
          height: 9px;
          border-radius:2px;
          margin-right:2px;
          display: inline-block;
          line-height:0;
        }
        .avatar{
          position:relative;
          height:56px;
        }
        .avatarBackground{
          background: RGBA(255,255,255,0.7);
          height: 46px;
          width: 46px;
          position: absolute;
          left: 50%;
          margin-left: -23px;
          top: 50%;
          margin-top: -23px;
          border-radius:60px;
        }
        .avatarForeground{
          height: 56px;
          width: 56px;
          position: absolute;
          left: 50%;
          margin-left: -28px;
          top: 50%;
          margin-top: -28px;
        }
        .activeUser{
          background: #FCFC1A;
          width: 100%;
          height:10px;
          margin-bottom:15px;
        }
        .yourTurn{
          background: #FCFC1A;
          width: 100%;
          height:20px;
        }
        .profile {
          display: inline-block;
          text-align:center;
          margin-right:15px;
        }
      `}</style>
    </div>
  )
}
