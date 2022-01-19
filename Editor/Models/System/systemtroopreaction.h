/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMTROOPREACTION_H
#define SYSTEMTROOPREACTION_H

#include <QMetaType>
#include "systemreaction.h"
#include "systemtroopreactionconditions.h"
#include "troopreactionfrequencykind.h"

// -------------------------------------------------------
//
//  CLASS SystemTroopReaction
//
//  A particulary troop reaction (datas).
//
// -------------------------------------------------------

class SystemTroopReaction : public SystemReaction
{
public:
    static const QString JSON_CONDITIONS;
    static const QString JSON_FREQUENCY;
    static const TroopReactionFrequencyKind DEFAULT_FREQUENCY;

    SystemTroopReaction();
    SystemTroopReaction(int i, QString n, SystemTroopReactionConditions
        *conditions = new SystemTroopReactionConditions,
        TroopReactionFrequencyKind frequency = DEFAULT_FREQUENCY);
    virtual ~SystemTroopReaction();
    SystemTroopReactionConditions * conditions() const;
    TroopReactionFrequencyKind frequency() const;
    void setFrequency(TroopReactionFrequencyKind frequency);

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SystemTroopReactionConditions *m_conditions;
    TroopReactionFrequencyKind m_frequency;
};

Q_DECLARE_METATYPE(SystemTroopReaction)

#endif // SYSTEMTROOPREACTION_H
