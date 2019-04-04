/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "animationsdatas.h"
#include "systemanimation.h"
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

void AnimationsDatas::setDefault(){
    int i, length;
    SystemAnimation *animation;
    QStandardItem *item;

    QString names[] = {
        "Attack"
    };
    length = (sizeof(names)/sizeof(*names));

    for (i = 0; i < length; i++) {
        animation = new SystemAnimation(i + 1, names[i]);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(animation)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(animation->toString());
        m_model->appendRow(item);
    }
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
