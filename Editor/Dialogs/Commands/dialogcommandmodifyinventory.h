/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDMODIFYINVENTORY_H
#define DIALOGCOMMANDMODIFYINVENTORY_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandModifyInventory
//
//  A dialog used for changing inventory of a character.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandModifyInventory;
}

class DialogCommandModifyInventory : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandModifyInventory(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel* parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandModifyInventory();
    EventCommand* getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;
    QStandardItemModel* m_properties;

    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandModifyInventory *ui;

    void selection(QVector<QString> &command) const;
    void operation(QVector<QString>& command) const;
    void value(QVector<QString>& command) const;
    void translate();

private slots:
    void on_radioButtonItem_toggled(bool checked);
    void on_radioButtonWeapon_toggled(bool checked);
    void on_radioButtonArmor_toggled(bool checked);
};

#endif // DIALOGCOMMANDMODIFYINVENTORY_H
