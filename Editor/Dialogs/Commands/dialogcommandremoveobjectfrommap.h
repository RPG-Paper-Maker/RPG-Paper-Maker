/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDREMOVEOBJECTFROMMAP_H
#define DIALOGCOMMANDREMOVEOBJECTFROMMAP_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandRemoveObjectFromMap
//
//  A dialog used for removing an object from the current map.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandRemoveObjectFromMap;
}

class DialogCommandRemoveObjectFromMap : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandRemoveObjectFromMap(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandRemoveObjectFromMap();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_modelObjects;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandRemoveObjectFromMap *ui;

    void translate();
};

#endif // DIALOGCOMMANDREMOVEOBJECTFROMMAP_H
