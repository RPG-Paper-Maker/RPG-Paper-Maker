/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEVARIABLES_H
#define DIALOGCOMMANDCHANGEVARIABLES_H

#include <QVector>
#include "dialogcommand.h"
#include "variablesdatas.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeVariables
//
//  A dialog used for changing one or several variables values.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeVariables;
}

class DialogCommandChangeVariables : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeVariables(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeVariables();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandChangeVariables *ui;
    QStandardItemModel* m_modelObjects;

    void selection(QVector<QString> &command) const;
    void operation(QVector<QString>& command) const;
    void value(QVector<QString>& command) const;

private slots:
    void on_radioButtonOneVariable_toggled(bool checked);
    void on_radioButtonRange_toggled(bool checked);
    void on_radioButtonNumber_toggled(bool checked);
    void on_radioButtonRandom_toggled(bool checked);
};

#endif // DIALOGCOMMANDCHANGEVARIABLES_H
