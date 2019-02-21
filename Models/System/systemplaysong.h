/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef SYSTEMPLAYSONG_H
#define SYSTEMPLAYSONG_H

#include "superlistitem.h"
#include "primitivevalue.h"
#include "eventcommand.h"

class SystemPlaySong : public SuperListItem
{
public:
    static const QString JSON_VOLUME;
    static const QString JSON_IS_START;
    static const QString JSON_START;
    static const QString JSON_IS_END;
    static const QString JSON_END;
    static const QString JSON_IS_SELECTED_BY_ID;
    static const QString JSON_VALUE_ID;

    SystemPlaySong();
    SystemPlaySong(int i, SongKind kind, PrimitiveValue *volume = new
        PrimitiveValue(100), bool isStart = false, PrimitiveValue *start = new
        PrimitiveValue(0.0), bool isEnd = false, PrimitiveValue *end = new
        PrimitiveValue(0.0), bool isSelectedByID = false, PrimitiveValue
        *valueID = new PrimitiveValue(1));
    virtual ~SystemPlaySong();
    SongKind kind();
    void setKind(SongKind k);
    PrimitiveValue * volume() const;
    bool isStart() const;
    void setIsStart(bool b);
    PrimitiveValue * start() const;
    bool isEnd() const;
    void setIsEnd(bool b);
    PrimitiveValue * end() const;
    bool isSelectedByID() const;
    void setIsSelectedByID(bool b);
    PrimitiveValue * valueID() const;

    void updateName();
    EventCommand * createEventCommand(EventCommandKind kind);
    void toEventCommand(EventCommand& command, EventCommandKind kind);

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemPlaySong &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SongKind m_kind;
    PrimitiveValue *m_volume;
    bool m_isStart;
    PrimitiveValue *m_start;
    bool m_isEnd;
    PrimitiveValue *m_end;
    bool m_isSelectedByID;
    PrimitiveValue *m_valueID;
};

#endif // SYSTEMPLAYSONG_H
