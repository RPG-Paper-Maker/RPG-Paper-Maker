/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemcommonreaction.h"
#include "widgettreecommands.h"
#include "rpm.h"
#include "systemcreateparameter.h"
#include "widgetsupertree.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCommonReaction::SystemCommonReaction() :
    SystemCommonReaction(1, "", new QStandardItemModel, new QStandardItemModel,
                         false)
{

}

SystemCommonReaction::SystemCommonReaction(int i, QString n,
                                           QStandardItemModel* params,
                                           QStandardItemModel* commands,
                                           bool bHero) :
    SystemReaction(i, n, commands, bHero),
    m_modelParameters(params)
{
    m_modelParameters->setHorizontalHeaderLabels(
                QStringList({"Name","Default value"}));
}

SystemCommonReaction::~SystemCommonReaction()
{
    SuperListItem::deleteModel(m_modelParameters);
}

QStandardItemModel* SystemCommonReaction::modelParameters() const {
    return m_modelParameters;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemCommonReaction::createCopy() const{
    SystemCommonReaction* super = new SystemCommonReaction;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCommonReaction::setCopy(const SystemCommonReaction& copy){
    SystemReaction::setCopy(copy);
    p_id = copy.p_id;

    // parameters
    SuperListItem::copy(m_modelParameters, copy.m_modelParameters);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemCommonReaction::read(const QJsonObject &json) {
    SuperListItem::read(json);
    SystemReaction::read(json);

    // Parameters
    SuperListItem::readTree(m_modelParameters, new SystemCreateParameter, json,
        "p");
}

// -------------------------------------------------------

void SystemCommonReaction::write(QJsonObject & json) const {
    SuperListItem::write(json);
    SystemReaction::write(json);

    // Parameters
    SuperListItem::writeTree(m_modelParameters, json, "p");
}
