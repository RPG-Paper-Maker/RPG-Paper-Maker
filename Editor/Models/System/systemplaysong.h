/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    QStandardItemModel * parameters() const;
    void setParameters(QStandardItemModel *parameters);
    QStandardItemModel * properties() const;
    void setProperties(QStandardItemModel *properties);

    void setDefault();
    void updateName();
    EventCommand * createEventCommand(EventCommandKind kind);
    void toEventCommand(EventCommand& command, EventCommandKind kind);
    void fromEventCommand(EventCommand& command);
    void getCommand(QVector<QString> &command) const;
    void initializeCommand(EventCommand *command, int &i);
    bool isNone() const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
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
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_properties;
};

#endif // SYSTEMPLAYSONG_H
