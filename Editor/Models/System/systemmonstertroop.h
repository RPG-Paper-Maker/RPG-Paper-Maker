/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    static const QString JSON_IS_SPECIFIC_POSITION;
    static const QString JSON_SPECIFIC_POSITION;
    static const bool DEFAULT_IS_SPECIFIC_POSITION;
    static const QString DEFAULT_SPECIFIC_POSITION;

    SystemMonsterTroop(int i = 1, QString n = "", int level = 1, bool isSpecificPosition =
        DEFAULT_IS_SPECIFIC_POSITION, PrimitiveValue *specificPosition = new
        PrimitiveValue(DEFAULT_SPECIFIC_POSITION));
    virtual ~SystemMonsterTroop();
    int level() const;
    void setLevel(int l);
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
    int m_level;
    bool m_isSpecificPosition;
    PrimitiveValue *m_specificPosition;
};

Q_DECLARE_METATYPE(SystemMonsterTroop)

#endif // SYSTEMMONSTERTROOP_H
