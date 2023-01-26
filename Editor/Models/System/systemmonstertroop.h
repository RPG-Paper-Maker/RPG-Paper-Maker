/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMMONSTERTROOP_H
#define SYSTEMMONSTERTROOP_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemMonsterTroop
//
//  A particulary monster troop (datas).
//
// -------------------------------------------------------

class SystemMonsterTroop : public SuperListItem
{
public:
    static const QString JSON_LEVEL;
    static const QString JSON_HIDDEN;
    static const QString JSON_IS_SPECIFIC_POSITION;
    static const QString JSON_SPECIFIC_POSITION;
    static const bool DEFAULT_HIDDEN;
    static const bool DEFAULT_IS_SPECIFIC_POSITION;
    static const QString DEFAULT_SPECIFIC_POSITION;

    SystemMonsterTroop(int i = 1, QString n = "", PrimitiveValue *level = new
        PrimitiveValue(1), PrimitiveValue *hidden = new PrimitiveValue(DEFAULT_HIDDEN),
        bool isSpecificPosition = DEFAULT_IS_SPECIFIC_POSITION, PrimitiveValue
        *specificPosition = new PrimitiveValue(DEFAULT_SPECIFIC_POSITION));
    virtual ~SystemMonsterTroop();
    PrimitiveValue * level() const;
    PrimitiveValue * hidden() const;
    bool isSpecificPosition() const;
    void setIsSpecificPosition(bool isSpecificPosition);
    PrimitiveValue * specificPosition() const;

    void updateName();

    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_level;
    PrimitiveValue *m_hidden;
    bool m_isSpecificPosition;
    PrimitiveValue *m_specificPosition;
};

Q_DECLARE_METATYPE(SystemMonsterTroop)

#endif // SYSTEMMONSTERTROOP_H
