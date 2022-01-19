/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGECHRONOMETER_H
#define DIALOGCOMMANDCHANGECHRONOMETER_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandChangeChronometer;
}

class DialogCommandChangeChronometer : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeChronometer(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeChronometer();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandChangeChronometer *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

public slots:
    void on_radioButtonStart_toggled(bool checked);
};

#endif // DIALOGCOMMANDCHANGECHRONOMETER_H
