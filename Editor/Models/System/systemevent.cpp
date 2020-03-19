/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemevent.h"
#include "systemcreateparameter.h"
#include "widgetsupertree.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemEvent::SystemEvent() :
    SystemEvent(1, "", new QStandardItemModel)
{

}

SystemEvent::SystemEvent(int i, QString n, QStandardItemModel* parameters) :
    SuperListItem(i,n),
    m_modelParameters(parameters)
{
    this->initializeHeaders();
}

SystemEvent::~SystemEvent(){
    SuperListItem::deleteModel(m_modelParameters);
}

QStandardItemModel* SystemEvent::modelParameters() const {
    return m_modelParameters;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemEvent::initializeHeaders() {
    m_modelParameters->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::NAME), RPM::translate(Translations::DEFAULT_VALUE)}));
}

// -------------------------------------------------------

SuperListItem* SystemEvent::createCopy() const{
    SystemEvent* super = new SystemEvent;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemEvent::setCopy(const SuperListItem &super) {
    const SystemEvent *event;

    SuperListItem::setCopy(super);

    event = reinterpret_cast<const SystemEvent *>(&super);

    // parameters
    SuperListItem::deleteModel(m_modelParameters, false);
    SuperListItem::copy(m_modelParameters, event->m_modelParameters);
    this->initializeHeaders();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemEvent::read(const QJsonObject &json){
    SuperListItem::read(json);

    // Parameters
    SuperListItem::readTree(m_modelParameters, new SystemCreateParameter, json,
        "p");
}

// -------------------------------------------------------

void SystemEvent::write(QJsonObject &json) const{
    SuperListItem::write(json);

    // Parameters
    SuperListItem::writeTree(m_modelParameters, json, "p");
}

