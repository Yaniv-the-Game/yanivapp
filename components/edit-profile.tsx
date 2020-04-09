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

    const avatarNames = ['avocado', 'cookie', 'strawberry']

    return (
        <div>
            <p>change profile</p>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <br/><br/>
            <table className='table' >
                <tr>   
                    <td>
                        <button className='avatarButton' onClick={() => setAvatar('avocado') }>
                            <Avatar name={'avocado'} mood={'good'} size={56} />
                        </button>
                    </td>
                    <td>
                        <button className='avatarButton' onClick={() => setAvatar('cookie') }>
                            <Avatar name={'cookie'} mood={'good'} size={56} />
                        </button>
                    </td>
                    <td>
                        <button className='avatarButton' onClick={() => setAvatar('strawberry') }>
                            <Avatar name={'strawberry'} mood={'good'} size={56} />
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button className='avatarButton' onClick={() => setAvatar('waffle') }>
                            <Avatar name={'waffle'} mood={'good'} size={56} />
                        </button>
                    </td>
                    <td>
                        <button className='avatarButton' onClick={() => setAvatar('muesli') }>
                            <Avatar name={'muesli'} mood={'good'} size={56} />
                        </button>
                    </td>
                    <td>
                        <button className='avatarButton' onClick={() => setAvatar('sandwich') }>
                            <Avatar name={'sandwich'} mood={'good'} size={56} />
                        </button>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <button className='avatarButton' onClick={() => setAvatar('gipfeli') }>
                            <Avatar name={'gipfeli'} mood={'good'} size={56} />
                        </button>
                    </td>
                </tr>
            </table>
            <button
                onClick={() => onChange({
                    id: profile.id,
                    name: name,
                    avatar: avatar,
                })
            }>change profile</button>

            <style jsx >{`

            .avatarButton {
                appearance: none;
                background: none;
                border: none;
                /*border-radius: 50%;*/
                padding: 2px;
                margin: 0;
                display: inline-block;
                font-size: 0;
            }

            .table {
                margin: 0 auto; /* or margin: 0 auto 0 auto */
            }
            `}</style>
        </div> 
    )
}
