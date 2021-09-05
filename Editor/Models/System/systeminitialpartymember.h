/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMINITIALPARTYMEMBER_H
#define SYSTEMINITIALPARTYMEMBER_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"
#include "teamkind.h"

class SystemInitialPartyMember : public SuperListItem
{
public:
    static const QString JSON_LEVEL;
    static const QString JSON_TEAM_KIND;
    static const QString JSON_IS_HERO;
    static const QString JSON_HERO_ID;
    static const QString JSON_MONSTER_ID;
    static const QString JSON_VARIABLE_INSTANCE_ID;
    static const int DEFAULT_LEVEL;
    static const TeamKind DEFAULT_TEAM_KIND;
    static const bool DEFAULT_IS_HERO;
    static const int DEFAULT_HERO_ID;
    static const int DEFAULT_MONSTER_ID;
    static const int DEFAULT_VARIABLE_INSTANCE_ID;

    SystemInitialPartyMember(int id = 1, QString name = "", PrimitiveValue *level =
        new PrimitiveValue(DEFAULT_LEVEL), TeamKind teamKind = DEFAULT_TEAM_KIND,
        bool isHero = DEFAULT_IS_HERO, PrimitiveValue *heroID = new PrimitiveValue(
        PrimitiveValueKind::DataBase, DEFAULT_HERO_ID), PrimitiveValue *monsterID =
        new PrimitiveValue(PrimitiveValueKind::DataBase, DEFAULT_HERO_ID),
        PrimitiveValue *variableInstanceID = new PrimitiveValue(PrimitiveValueKind
        ::Variable, DEFAULT_VARIABLE_INSTANCE_ID));
    virtual ~SystemInitialPartyMember();

    PrimitiveValue * level() const;
    TeamKind teamKind() const;
    void setTeamKind(TeamKind teamKind);
    bool isHero() const;
    void setIsHero(bool isHero);
    PrimitiveValue * heroID() const;
    PrimitiveValue * monsterID() const;
    PrimitiveValue * variableInstanceID() const;

    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_level;
    TeamKind m_teamKind;
    bool m_isHero;
    PrimitiveValue *m_heroID;
    PrimitiveValue *m_monsterID;
    PrimitiveValue *m_variableInstanceID;
};

Q_DECLARE_METATYPE(SystemInitialPartyMember)

#endif // SYSTEMINITIALPARTYMEMBER_H
