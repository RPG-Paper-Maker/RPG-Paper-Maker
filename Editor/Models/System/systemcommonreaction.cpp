/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
        true)
{

}

SystemCommonReaction::SystemCommonReaction(int i, QString n,
                                           QStandardItemModel* params,
                                           QStandardItemModel* commands,
                                           bool bHero) :
    SystemReaction(i, n, commands, bHero),
    m_modelParameters(params)
{
    this->initializeHeaders();
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

void SystemCommonReaction::initializeHeaders() {
    m_modelParameters->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::NAME), RPM::translate(Translations::DEFAULT_VALUE)}));
}

// -------------------------------------------------------

SuperListItem* SystemCommonReaction::createCopy() const{
    SystemCommonReaction* super = new SystemCommonReaction;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCommonReaction::setCopy(const SuperListItem &super) {
    const SystemCommonReaction *reaction;

    SystemReaction::setCopy(super);
    reaction = reinterpret_cast<const SystemCommonReaction *>(&super);
    p_id = reaction->p_id;

    // parameters
    SuperListItem::deleteModel(m_modelParameters, false);
    SuperListItem::copy(m_modelParameters, reaction->m_modelParameters);
    this->initializeHeaders();
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
