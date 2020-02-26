/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemanimationframeeffect.h"
#include "dialogsystemanimationframeeffect.h"
#include "rpm.h"

const QString SystemAnimationFrameEffect::JSON_IS_SOUND_EFFECT = "ise";
const QString SystemAnimationFrameEffect::JSON_SOUND_EFFECT = "se";
const QString SystemAnimationFrameEffect::JSON_CONDITION = "c";
const bool SystemAnimationFrameEffect::DEFAULT_IS_SOUND_EFFECT = true;
const int SystemAnimationFrameEffect::DEFAULT_SOUND_EFFECT = -1;
const AnimationEffectConditionKind SystemAnimationFrameEffect::DEFAULT_CONDITION
    = AnimationEffectConditionKind::None;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemAnimationFrameEffect::SystemAnimationFrameEffect() :
    SystemAnimationFrameEffect(-1, "")
{

}

SystemAnimationFrameEffect::SystemAnimationFrameEffect(int i, QString n, bool
    ise, int se, AnimationEffectConditionKind c) :
    SuperListItem(i, n),
    m_isSoundEffect(ise),
    m_soundEffect(new SystemPlaySong(se, SongKind::Sound)),
    m_condition(c)
{

}

SystemAnimationFrameEffect::~SystemAnimationFrameEffect() {
    delete m_soundEffect;
}

bool SystemAnimationFrameEffect::isSoundEffect() const {
    return m_isSoundEffect;
}

void SystemAnimationFrameEffect::setIsSoundEffect(bool ise) {
    m_isSoundEffect = ise;
}

SystemPlaySong * SystemAnimationFrameEffect::soundEffect() const {
    return m_soundEffect;
}

AnimationEffectConditionKind SystemAnimationFrameEffect::condition() const {
    return m_condition;
}

void SystemAnimationFrameEffect::setCondition(AnimationEffectConditionKind c) {
    m_condition = c;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemAnimationFrameEffect::openDialog() {
    SystemAnimationFrameEffect element;

    element.setCopy(*this);
    DialogSystemAnimationFrameEffect dialog(element);
    if (dialog.exec() == QDialog::Accepted) {
        this->setCopy(element);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemAnimationFrameEffect::createCopy() const {
    SystemAnimationFrameEffect *super = new SystemAnimationFrameEffect;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemAnimationFrameEffect::setCopy(const SuperListItem &super) {
    const SystemAnimationFrameEffect *sys;

    sys = reinterpret_cast<const SystemAnimationFrameEffect *>(&super);
    m_isSoundEffect = sys->m_isSoundEffect;
    m_soundEffect->setCopy(*sys->m_soundEffect);
    m_condition = sys->m_condition;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemAnimationFrameEffect::getModelRow() const {
    QList<QStandardItem *> row = QList<QStandardItem *>();
    QStandardItem *itemTypeID = new QStandardItem;
    QStandardItem *itemCondition = new QStandardItem;
    itemTypeID->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemTypeID->setText(SuperListItem::beginningText + (m_isSoundEffect ?
        "Sound effect" : "Flash") + " / " + m_soundEffect->toString());
    itemTypeID->setFlags(itemTypeID->flags() ^ (Qt::ItemIsDropEnabled));
    itemCondition->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemCondition->setText(RPM::ENUM_TO_STRING_ANIMATION_CONDITION_KIND.at(
        static_cast<int>(m_condition)));
    itemCondition->setFlags(itemCondition->flags() ^ (Qt::ItemIsDropEnabled));
    row.append(itemTypeID);
    row.append(itemCondition);

    return row;
}

// -------------------------------------------------------

void SystemAnimationFrameEffect::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_IS_SOUND_EFFECT)) {
        m_isSoundEffect = json[JSON_IS_SOUND_EFFECT].toBool();
    }
    if (m_isSoundEffect) {
        m_soundEffect->read(json[JSON_SOUND_EFFECT].toObject());
    }
    if (json.contains(JSON_CONDITION)) {
        m_condition = static_cast<AnimationEffectConditionKind>(json[
            JSON_CONDITION].toInt());
    }
}

// -------------------------------------------------------

void SystemAnimationFrameEffect::write(QJsonObject &json) const {
    SuperListItem::write(json);
    QJsonObject obj;

    if (m_isSoundEffect != DEFAULT_IS_SOUND_EFFECT) {
        json[JSON_IS_SOUND_EFFECT] = m_isSoundEffect;
    }
    if (m_isSoundEffect) {
        m_soundEffect->write(obj);
        json[JSON_SOUND_EFFECT] = obj;
    }
    if (m_condition != DEFAULT_CONDITION) {
        json[JSON_CONDITION] = static_cast<int>(m_condition);
    }
}
