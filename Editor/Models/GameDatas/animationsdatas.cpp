/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "animationsdatas.h"
#include "systemanimation.h"
#include "systemanimationframe.h"
#include "rpm.h"
#include "common.h"

const QString AnimationsDatas::JSON_ANIMATIONS = "animations";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

AnimationsDatas::AnimationsDatas() {
    m_model = new QStandardItemModel;
}

AnimationsDatas::~AnimationsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void AnimationsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_ANIMATIONS), *this);
}

QStandardItemModel* AnimationsDatas::model() const {
    return m_model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void AnimationsDatas::setDefault() {
    SystemAnimation *animation;
    QStandardItem *item;

    item = m_model->item(0);
    animation = reinterpret_cast<SystemAnimation *>(item->data().value<quintptr>());
    animation->setName(RPM::translate(Translations::ATTACK));
    item->setText(animation->toString());
}

void AnimationsDatas::setDefaultTranslations()
{
    SuperListItem::setModelItemName(m_model, 0, RPM::translate(Translations::HIT));
    SuperListItem::setModelItemName(m_model, 1, RPM::translate(Translations::CUT));
    SuperListItem::setModelItemName(m_model, 2, RPM::translate(Translations::CLAW));
    SuperListItem::setModelItemName(m_model, 3, RPM::translate(Translations::FANG));
    SuperListItem::setModelItemName(m_model, 4, RPM::translate(Translations::BULLET));
    SuperListItem::setModelItemName(m_model, 5, RPM::translate(Translations::ARROW));
    SuperListItem::setModelItemName(m_model, 6, RPM::translate(Translations::ITEM));
    SuperListItem::setModelItemName(m_model, 7, RPM::translate(Translations::CAST_MAGIC));
    SuperListItem::setModelItemName(m_model, 8, RPM::translate(Translations::BLAZING_SWORD));
    SuperListItem::setModelItemName(m_model, 9, RPM::translate(Translations::POWER));
    SuperListItem::setModelItemName(m_model, 10, RPM::translate(Translations::BANDAGE));
    SuperListItem::setModelItemName(m_model, 11, RPM::translate(Translations::CROSS_AXE));
    SuperListItem::setModelItemName(m_model, 12, RPM::translate(Translations::WAR_CRY));
    SuperListItem::setModelItemName(m_model, 13, RPM::translate(Translations::HEAVY_JUMP));
    SuperListItem::setModelItemName(m_model, 14, RPM::translate(Translations::PIC_LANCE));
    SuperListItem::setModelItemName(m_model, 15, RPM::translate(Translations::LONG_SLAY));
    SuperListItem::setModelItemName(m_model, 16, RPM::translate(Translations::CONCENTRATION));
    SuperListItem::setModelItemName(m_model, 17, RPM::translate(Translations::STEEL));
    SuperListItem::setModelItemName(m_model, 18, RPM::translate(Translations::STABBING));
    SuperListItem::setModelItemName(m_model, 19, RPM::translate(Translations::ILLUSION));
    SuperListItem::setModelItemName(m_model, 20, RPM::translate(Translations::FIRE_1));
    SuperListItem::setModelItemName(m_model, 21, RPM::translate(Translations::FIRE_2));
    SuperListItem::setModelItemName(m_model, 22, RPM::translate(Translations::FIRE_3));
    SuperListItem::setModelItemName(m_model, 23, RPM::translate(Translations::EARTH_1));
    SuperListItem::setModelItemName(m_model, 24, RPM::translate(Translations::EARTH_2));
    SuperListItem::setModelItemName(m_model, 25, RPM::translate(Translations::EARTH_3));
    SuperListItem::setModelItemName(m_model, 26, RPM::translate(Translations::THUNDER_1));
    SuperListItem::setModelItemName(m_model, 27, RPM::translate(Translations::THUNDER_2));
    SuperListItem::setModelItemName(m_model, 28, RPM::translate(Translations::THUNDER_3));
    SuperListItem::setModelItemName(m_model, 29, RPM::translate(Translations::WATER_1));
    SuperListItem::setModelItemName(m_model, 30, RPM::translate(Translations::WATER_2));
    SuperListItem::setModelItemName(m_model, 31, RPM::translate(Translations::WATER_3));
    SuperListItem::setModelItemName(m_model, 32, RPM::translate(Translations::ICE_1));
    SuperListItem::setModelItemName(m_model, 33, RPM::translate(Translations::ICE_2));
    SuperListItem::setModelItemName(m_model, 34, RPM::translate(Translations::ICE_3));
    SuperListItem::setModelItemName(m_model, 35, RPM::translate(Translations::WIND_1));
    SuperListItem::setModelItemName(m_model, 36, RPM::translate(Translations::WIND_2));
    SuperListItem::setModelItemName(m_model, 37, RPM::translate(Translations::WIND_3));
    SuperListItem::setModelItemName(m_model, 38, RPM::translate(Translations::DARKNESS_1));
    SuperListItem::setModelItemName(m_model, 39, RPM::translate(Translations::DARKNESS_2));
    SuperListItem::setModelItemName(m_model, 40, RPM::translate(Translations::DARKNESS_3));
    SuperListItem::setModelItemName(m_model, 41, RPM::translate(Translations::LIGHT_1));
    SuperListItem::setModelItemName(m_model, 42, RPM::translate(Translations::LIGHT_2));
    SuperListItem::setModelItemName(m_model, 43, RPM::translate(Translations::LIGHT_3));
    SuperListItem::setModelItemName(m_model, 44, RPM::translate(Translations::HEAL_1));
    SuperListItem::setModelItemName(m_model, 45, RPM::translate(Translations::HEAL_2));
    SuperListItem::setModelItemName(m_model, 46, RPM::translate(Translations::HEAL_3));
    SuperListItem::setModelItemName(m_model, 47, RPM::translate(Translations::BARRIER_1));
    SuperListItem::setModelItemName(m_model, 48, RPM::translate(Translations::BARRIER_2));
    SuperListItem::setModelItemName(m_model, 49, RPM::translate(Translations::REMEDY_1));
    SuperListItem::setModelItemName(m_model, 50, RPM::translate(Translations::REMEDY_2));
    SuperListItem::setModelItemName(m_model, 51, RPM::translate(Translations::WEAK_1));
    SuperListItem::setModelItemName(m_model, 52, RPM::translate(Translations::WEAK_1));
    SuperListItem::setModelItemName(m_model, 53, RPM::translate(Translations::POISON_1));
    SuperListItem::setModelItemName(m_model, 54, RPM::translate(Translations::POISON_2));
    SuperListItem::setModelItemName(m_model, 55, RPM::translate(Translations::BURN_1));
    SuperListItem::setModelItemName(m_model, 56, RPM::translate(Translations::BURN_2));
    SuperListItem::setModelItemName(m_model, 57, RPM::translate(Translations::MUTE_1));
    SuperListItem::setModelItemName(m_model, 58, RPM::translate(Translations::MUTE_2));
    SuperListItem::setModelItemName(m_model, 59, RPM::translate(Translations::CONFUSE_1));
    SuperListItem::setModelItemName(m_model, 60, RPM::translate(Translations::CONFUSE_2));
    SuperListItem::setModelItemName(m_model, 61, RPM::translate(Translations::SLEEP_1));
    SuperListItem::setModelItemName(m_model, 62, RPM::translate(Translations::SLEEP_2));
    SuperListItem::setModelItemName(m_model, 63, RPM::translate(Translations::BLINK_1));
    SuperListItem::setModelItemName(m_model, 64, RPM::translate(Translations::BLINK_2));
    SuperListItem::setModelItemName(m_model, 65, RPM::translate(Translations::REVIVE_1));
    SuperListItem::setModelItemName(m_model, 66, RPM::translate(Translations::REVIVE_2));
    SuperListItem::setModelItemName(m_model, 67, RPM::translate(Translations::SILVER_BULLET));
    SuperListItem::setModelItemName(m_model, 68, RPM::translate(Translations::PARALYZE_BULLET));
    SuperListItem::setModelItemName(m_model, 69, RPM::translate(Translations::HEAL_BULLET));
    SuperListItem::setModelItemName(m_model, 70, RPM::translate(Translations::MAGIC_ARROW));
    SuperListItem::setModelItemName(m_model, 71, RPM::translate(Translations::POISON_ARROW));
    SuperListItem::setModelItemName(m_model, 72, RPM::translate(Translations::MUTE_ARROW));
    SuperListItem::setModelItemName(m_model, 73, RPM::translate(Translations::HP_POTION));
    SuperListItem::setModelItemName(m_model, 74, RPM::translate(Translations::SUPER_HP_POTION));
    SuperListItem::setModelItemName(m_model, 75, RPM::translate(Translations::MEGA_HP_POTION));
    SuperListItem::setModelItemName(m_model, 76, RPM::translate(Translations::MP_POTION));
    SuperListItem::setModelItemName(m_model, 77, RPM::translate(Translations::SUPER_MP_POTION));
    SuperListItem::setModelItemName(m_model, 78, RPM::translate(Translations::MEGA_MP_POTION));
    SuperListItem::setModelItemName(m_model, 79, RPM::translate(Translations::TP_POTION));
    SuperListItem::setModelItemName(m_model, 80, RPM::translate(Translations::SUPER_TP_POTION));
    SuperListItem::setModelItemName(m_model, 81, RPM::translate(Translations::MEGA_TP_POTION));
    SuperListItem::setModelItemName(m_model, 82, RPM::translate(Translations::PHOENIX_FEATHER));
    SuperListItem::setModelItemName(m_model, 83, RPM::translate(Translations::EMOTE_1));
    SuperListItem::setModelItemName(m_model, 84, RPM::translate(Translations::EMOTE_2));
    SuperListItem::setModelItemName(m_model, 85, RPM::translate(Translations::EMOTE_3));
    SuperListItem::setModelItemName(m_model, 86, RPM::translate(Translations::EMOTE_4));
    SuperListItem::setModelItemName(m_model, 87, RPM::translate(Translations::EMOTE_5));
    SuperListItem::setModelItemName(m_model, 88, RPM::translate(Translations::EMOTE_6));
    SuperListItem::setModelItemName(m_model, 89, RPM::translate(Translations::EMOTE_7));
    SuperListItem::setModelItemName(m_model, 90, RPM::translate(Translations::EMOTE_8));
    SuperListItem::setModelItemName(m_model, 91, RPM::translate(Translations::EMOTE_9));
    SuperListItem::setModelItemName(m_model, 92, RPM::translate(Translations::EMOTE_10));
    SuperListItem::setModelItemName(m_model, 93, RPM::translate(Translations::EMOTE_11));
    SuperListItem::setModelItemName(m_model, 94, RPM::translate(Translations::EMOTE_12));
    SuperListItem::setModelItemName(m_model, 95, RPM::translate(Translations::EMOTE_13));
    SuperListItem::setModelItemName(m_model, 96, RPM::translate(Translations::EMOTE_14));
    SuperListItem::setModelItemName(m_model, 97, RPM::translate(Translations::EMOTE_15));
    SuperListItem::setModelItemName(m_model, 98, RPM::translate(Translations::EMOTE_16));
    SuperListItem::setModelItemName(m_model, 99, RPM::translate(Translations::EMOTE_17));
    SuperListItem::setModelItemName(m_model, 100, RPM::translate(Translations::EMOTE_18));
    SuperListItem::setModelItemName(m_model, 101, RPM::translate(Translations::EMOTE_19));
    SuperListItem::setModelItemName(m_model, 102, RPM::translate(Translations::EMOTE_20));
    SuperListItem::setModelItemName(m_model, 103, RPM::translate(Translations::EMOTE_21));
    SuperListItem::setModelItemName(m_model, 104, RPM::translate(Translations::EMOTE_22));
    SuperListItem::setModelItemName(m_model, 105, RPM::translate(Translations::EMOTE_23));
    SuperListItem::setModelItemName(m_model, 106, RPM::translate(Translations::EMOTE_24));
    SuperListItem::setModelItemName(m_model, 107, RPM::translate(Translations::EMOTE_25));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void AnimationsDatas::read(const QJsonObject &json) {
    SystemAnimation *animation;
    QStandardItem *item;

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json[JSON_ANIMATIONS].toArray();
    for (int i = 0; i < jsonList.size(); i++) {
        item = new QStandardItem;
        animation = new SystemAnimation;
        animation->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(animation)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(animation->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void AnimationsDatas::write(QJsonObject &json) const {
    int i, l;
    QJsonArray tab;
    QJsonObject obj;
    SystemAnimation *animation;

    for (i = 0, l = m_model->invisibleRootItem()->rowCount(); i < l; i++) {
        obj = QJsonObject();
        animation = reinterpret_cast<SystemAnimation *>(m_model->item(i)->data()
            .value<quintptr>());
        animation->write(obj);
        tab.append(obj);
    }
    json[JSON_ANIMATIONS] = tab;
}
