/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef SYSTEMSTATE_H
#define SYSTEMSTATE_H

#include <QMetaType>
#include "superlistitem.h"
#include "systemcommonobject.h"
#include "systemobjectevent.h"

// -------------------------------------------------------
//
//  CLASS SystemState
//
//  A particulary state (datas).
//
// -------------------------------------------------------

class SystemState : public SuperListItem
{
public:
    SystemState();
    SystemState(SuperListItem* state, bool m, bool s, bool d, bool t, bool c,
                bool p);
    virtual ~SystemState();
    virtual QString name() const;
    SuperListItem* state() const;
    void setState(SuperListItem* s);
    bool moveAnimation() const;
    bool stopAnimation() const;
    bool directionFix() const;
    bool through() const;
    bool setWithCamera() const;
    bool pixelOffset() const;
    void setMoveAnimation(bool b);
    void setStopAnimation(bool b);
    void setDirectionFix(bool b);
    void setThrough(bool b);
    void setSetWithCamera(bool b);
    void setPixelOffset(bool b);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemState &state);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SuperListItem* m_state;
    bool m_moveAnimation;
    bool m_stopAnimation;
    bool m_directionFix;
    bool m_through;
    bool m_setWithCamera;
    bool m_pixelOffset;
};

Q_DECLARE_METATYPE(SystemState)

#endif // SYSTEMSTATE_H
