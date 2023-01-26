/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMANIMATIONFRAMEEFFECT_H
#define SYSTEMANIMATIONFRAMEEFFECT_H

#include "superlistitem.h"
#include "animationeffectconditionkind.h"
#include "systemplaysong.h"

// -------------------------------------------------------
//
//  CLASS SystemAnimationFrameElement
//
//  A particulary animation frame element (datas).
//
// -------------------------------------------------------

class SystemAnimationFrameEffect : public SuperListItem
{
public:
    static const QString JSON_IS_SOUND_EFFECT;
    static const QString JSON_SOUND_EFFECT;
    static const QString JSON_CONDITION;
    static const bool DEFAULT_IS_SOUND_EFFECT;
    static const int DEFAULT_SOUND_EFFECT;
    static const AnimationEffectConditionKind DEFAULT_CONDITION;

    SystemAnimationFrameEffect();
    SystemAnimationFrameEffect(int i, QString n, bool ise =
        DEFAULT_IS_SOUND_EFFECT, int se = DEFAULT_SOUND_EFFECT,
        AnimationEffectConditionKind c = DEFAULT_CONDITION);
    virtual ~SystemAnimationFrameEffect();
    bool isSoundEffect() const;
    void setIsSoundEffect(bool ise);
    SystemPlaySong * soundEffect() const;
    AnimationEffectConditionKind condition() const;
    void setCondition(AnimationEffectConditionKind c);

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem *> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isSoundEffect;
    SystemPlaySong *m_soundEffect;
    AnimationEffectConditionKind m_condition;
};

#endif // SYSTEMANIMATIONFRAMEEFFECT_H
