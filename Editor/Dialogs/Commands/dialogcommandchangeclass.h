/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGECLASS_H
#define DIALOGCOMMANDCHANGECLASS_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandChangeClass;
}

class DialogCommandChangeClass : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeClass(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeClass();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandChangeClass *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

public slots:
    void on_radioButtonHeroEnemyInstanceID_toggled(bool checked);
    void on_radioButtonEntire_toggled(bool checked);
};

#endif // DIALOGCOMMANDCHANGECLASS_H
