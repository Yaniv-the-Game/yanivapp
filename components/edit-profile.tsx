import React, { useState } from 'react'
import Avatar from '../components/avatar'

export default function EditProfile({
    profile,
    onChange,
}: {
    profile: {
        id: string,
        name: string,
        avatar: string,
    },
    onChange: (profile) => void
}) {
    const [name, setName] = useState(profile.name)
    const [avatar, setAvatar] = useState(profile.avatar)

    profile = {
      id: profile.id,
      name: name,
      avatar: avatar,
    }

    const avatarNames = ['avocado', 'cookie', 'strawberry','waffle','muesli','sandwich','gipfeli']

    return (
      <div>
        <p>change profile</p>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button
        onClick={() => onChange({
          id: profile.id,
          name: name,
          avatar: avatar,
        })
      }>change Name</button>
        <br/><br/>

        <div className='avatars'>
          {avatarNames.map((ava) => (
            <div className="avatar" key={ava}>
              {ava === profile.avatar && (
                <div className="avatarBackground"></div>
              )}
              <div className="avatarForeground" onClick={() => setAvatar(ava) } >
                <Avatar name={ava} mood={'good'} size={56} />
              </div>
            </div>
          ))}
      </div>

    <style jsx >{`

      .avatar{
        height:56px;
        width:56px;
        display: inline-block;
        margin-right:15px;
        position:relative;
        cursor: pointer;

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
      `}</style>
      </div>
    )
}
