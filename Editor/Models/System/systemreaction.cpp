/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemreaction.h"
#include "widgettreecommands.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemReaction::SystemReaction() :
    SystemReaction(1, "", new QStandardItemModel, true)
{

}

SystemReaction::SystemReaction(int i, QString n, QStandardItemModel* commands,
                               bool bHero) :
    SuperListItem(i,n),
    m_modelCommands(commands),
    m_blockingHero(bHero)
{
    addEmptyCommand(m_modelCommands->invisibleRootItem());
}

SystemReaction::~SystemReaction()
{
    deleteCommands(m_modelCommands->invisibleRootItem());
    delete m_modelCommands;
}

QStandardItemModel* SystemReaction::modelCommands() const {
    return m_modelCommands;
}

bool SystemReaction::blockingHero() const { return m_blockingHero; }

void SystemReaction::setBlockingHero(bool b) { m_blockingHero = b; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemReaction::createCopy() const{
    SystemReaction* super = new SystemReaction;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemReaction::setCopy(const SystemReaction& copy){
    SuperListItem::setCopy(copy);
    p_id = copy.p_id;

    copyCommands(copy.m_modelCommands, m_modelCommands);
    m_blockingHero = copy.m_blockingHero;
}

// -------------------------------------------------------

void SystemReaction::addEmptyCommand(QStandardItem *root){
    addCommand(root, new EventCommand());
}

// -------------------------------------------------------

void SystemReaction::addCommand(QStandardItem *root, EventCommand* command){
    QStandardItem * item = new QStandardItem();
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(command)));
    item->setText(command->toString());
    root->appendRow(item);
}

// -------------------------------------------------------

void SystemReaction::addCommandWithoutText(QStandardItem *root,
                                           EventCommand* command)
{
    QStandardItem * item = new QStandardItem();
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(command)));
    root->appendRow(item);
}

// -------------------------------------------------------

void SystemReaction::copyCommands(const QStandardItemModel* from,
                                  QStandardItemModel* to)
{
    deleteCommands(to->invisibleRootItem());
    to->clear();
    copyCommandsItem(from->invisibleRootItem(), to->invisibleRootItem());
}

// -------------------------------------------------------

void SystemReaction::copyCommandsItem(const QStandardItem* from,
                                      QStandardItem* to)
{
    // Copy the current row
    EventCommand* command = (EventCommand*) from->data().value<quintptr>();
    if (command != nullptr){
        EventCommand* copyCommand = new EventCommand;
        copyCommand->setCopy(*command);
        to->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(copyCommand)));
        to->setText(from->text());
    }

    // Copy children
    for (int i = 0; i < from->rowCount(); i++){
        to->appendRow(new QStandardItem);
        copyCommandsItem(from->child(i), to->child(i));
    }
}

// -------------------------------------------------------

void SystemReaction::deleteCommands(QStandardItem* item){
    EventCommand* command = (EventCommand*) item->data().value<quintptr>();

    for (int i = 0; i < item->rowCount(); i++)
        deleteCommands(item->child(i));

    if (command != nullptr)
        delete command;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemReaction::read(const QJsonObject &json){

    // Commands
    readRoot(json["c"].toArray(), m_modelCommands->invisibleRootItem());

    // Options
    m_blockingHero = json["bh"].toBool();
}

// -------------------------------------------------------

void SystemReaction::readRoot(const QJsonArray &json, QStandardItem* root){
    for (int i = 0; i < json.size(); i++) {
        QJsonObject obj = json[i].toObject();

        // Reading the event command and adding it to the Tree View
        EventCommand* ev = new EventCommand();
        ev->read(obj);
        QStandardItem * item = new QStandardItem();
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(ev)));
        if (obj.contains("children")){
            readRoot(obj["children"].toArray(), item);
            addEmptyCommand(item);
        }
        root->insertRow(i, item);
    }
}

// -------------------------------------------------------

void SystemReaction::write(QJsonObject & json) const{

    // Commands
    json["c"] = getChildrenJSON(m_modelCommands->invisibleRootItem());

    // Options
    json["bh"] = m_blockingHero;
}

// -------------------------------------------------------

QJsonArray SystemReaction::getChildrenJSON(QStandardItem* item) const{
    QJsonArray tab;
    for (int i = 0; i < item->rowCount(); i++){
        if (((EventCommand*) item->child(i)->data().value<quintptr>())->kind()
                != EventCommandKind::None)
        {
            QJsonObject json = ((EventCommand*) item->child(i)->data()
                                .value<quintptr>())->getJSON();
            if (item->child(i)->hasChildren()){
                json["children"] = getChildrenJSON(item->child(i));
            }
            tab.append(json);
        }
    }
    return tab;
}
